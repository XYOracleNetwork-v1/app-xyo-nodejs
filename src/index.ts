/*
 * File: index.ts
 * Project: @xyo-network/app
 * File Created: Tuesday, 16th April 2019 9:19:05 am
 * Author: XYO Development Team (support@xyo.network)
 * -----
 * Last Modified: Tuesday, 16th April 2019 9:55:22 am
 * Modified By: XYO Development Team (support@xyo.network>)
 * -----
 * Copyright 2017 - 2019 XY - The Persistent Company
 */

import { IXyoPluginWithConfig, IXyoConfig, XyoBase, IXyoPlugin } from '@xyo-network/sdk-base-nodejs'
import { XyoGraphQlEndpoint } from './graphql/graohql-delegate'
import { PluginResolver } from './plugin-resolver'
import { XyoMutexHandler } from './mutex'
import commander from 'commander'
import fs from 'fs'
import { resolve } from 'path'
import { PluginsWizard } from './wizard/choose-plugin-wizard'

const configPath = resolve('./xyo.json')

const defaultConfig = {
  port: 11001,
  plugins: [
    {
      packageName: 'base-graphql-types',
      path: resolve('./dist/plugins/base-graphql-types'),
      config: {
        name: 'unknown',
        ip: 'localhost'
      }
    },
    {
      packageName: 'file-origin-state',
      path: resolve('./dist/plugins/origin-state'),
      config: {}
    },
  ]
}

export class App extends XyoBase {
  public async main() {
    commander.option('-a, --addPlugin <string>', 'install plugin')
    commander.option('-d, --removePlugin <string>', 'install plugin')
    commander.option('-i, --addRepository <string>', 'install repository')
    commander.option('-c, --config', 'config file override path')
    commander.option('-l, --list', 'lists plugin')
    commander.option('-r, --run', 'runs node')
    commander.parse(process.argv)

    if (!fs.existsSync(configPath) && !commander.config) {
      fs.writeFileSync(configPath, JSON.stringify(defaultConfig))
    }

    this.logInfo(`Using config at path: ${commander.config || configPath}`)

    if (commander.list) { await this.listCommand(); return }
    if (commander.addPlugin) { await this.installCommand(); return }
    if (commander.addRepository) { await this.addRepositoryCommand(); return }
    if (commander.run) { await this.runCommand(); return }
    if (commander.removePlugin) { await this.removePlugin(); return }

    commander.outputHelp()
  }

  private async runCommand() {
    const delegate = new XyoGraphQlEndpoint()
    const mutex = new XyoMutexHandler()
    const resolver = new PluginResolver(delegate, mutex)
    const config = await this.readConfigFromPath(commander.config || configPath)
    const plugins = await this.getPluginsFromConfig(config)
    await resolver.resolve(plugins)
    const server = delegate.start(config.port)
    server.start()
  }

  private async removePlugin() {
    const config = await this.readConfigFromPath(commander.config || configPath)
    config.plugins = config.plugins.filter((plugin) => {
      const isToRemove = plugin.packageName === commander.removePlugin

      if (isToRemove) {
        this.logInfo(`Removed plugin: ${plugin.packageName}`)
      }

      return !isToRemove
    })
    await this.saveConfig(config)
  }

  private async addRepositoryCommand() {
    this.logInfo(`Adding repository: ${commander.addRepository}`)

    try {
      const repositoryPath = resolve(commander.addRepository)
      const repository = require(`${repositoryPath}/package.json`)
      const pluginPaths = repository.xyoPlugins as string[]
      const plugins: IXyoPlugin[] = []

      for (const pluginPath of pluginPaths) {
        const plugin = this.getSinglePlugin(`${repositoryPath}/${pluginPath}`)
        plugins.push(plugin)
      }

      const wizard = new PluginsWizard(plugins.map(plugin => plugin.getName()))

      const pluginsToInstall = await wizard.start()

      for (const pluginToInstall of pluginsToInstall) {
        for (const i in plugins) {
          if (pluginToInstall === plugins[i].getName()) {
            await this.addPlugin(plugins[i], `${repositoryPath}/${pluginPaths[i]}`)
          }
        }
      }

    } catch (error) {
      this.logError(`Can not find repository ${commander.addRepository}`)
    }
  }

  private async addPlugin(plugin: IXyoPlugin, path: string) {
    const config = await this.readConfigFromPath(commander.config || configPath)

    for (const installedPlugin of config.plugins) {
      if (plugin.getName() === installedPlugin.packageName) {
        // plugin is already installed
        return
      }
    }

    config.plugins.push({
      path: resolve(path),
      packageName: plugin.getName(),
      config: {}
    })

    await this.saveConfig(config)
  }

  private async installCommand() {
    this.logInfo(`Installing plugin: ${commander.addPlugin}`)

    const plugin = this.getSinglePlugin(commander.addPlugin)

    await this.addPlugin(plugin, commander.addPlugin)

    this.logInfo(`Installed plugin: ${commander.addPlugin}`)
  }

  private async listCommand() {
    this.listPluginsInConfig()
    return
  }

  private async listPluginsInConfig() {
    const config = await this.readConfigFromPath(commander.config || configPath)

    config.plugins.forEach((plugin) => {
      this.logInfo(`Using plugin ✅: \u001b[36m${plugin.packageName}\u001b[0m`)
    })

  }

  private async getPluginsFromConfig(config: IXyoConfig): Promise<IXyoPluginWithConfig[]> {
    const foundPlugins: IXyoPluginWithConfig[] = []

    for (const pluginConfig of config.plugins) {
      try {
        if (pluginConfig.path) {
          const plugin = require(pluginConfig.path)
          foundPlugins.push({
            plugin,
            config: pluginConfig.config
          })
        } else {
          const plugin = require(pluginConfig.packageName)
          foundPlugins.push({
            plugin,
            config: pluginConfig.config
          })
        }
      } catch {
        this.logError(`Can not find plugin: ${pluginConfig.packageName}`)
        process.exit(1)
      }
    }

    await this.listPluginsInConfig()

    return foundPlugins
  }

  private getSinglePlugin(path: string): IXyoPlugin {
    try {
      return require(path) as IXyoPlugin
    } catch {
      this.logError(`Can not find plugin: ${path}`)
      throw new Error(`Can not find plugin: ${path}`)
    }
  }

  private saveConfig(config: IXyoConfig) {
    fs.writeFileSync(configPath, JSON.stringify(config))
  }

  private async readConfigFromPath(path: string): Promise<IXyoConfig> {
    try {
      return require(path) as IXyoConfig
    } catch (error) {
      console.log(error)
      this.logError(`Can not find config at path: ${path}`)
      process.exit(1)
      throw new Error()
    }
  }

}
