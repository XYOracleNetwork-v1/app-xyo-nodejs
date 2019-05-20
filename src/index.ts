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

import { IXyoPluginWithConfig, IXyoConfig, XyoBase, IXyoPlugin, IXyoRemoteConfig } from '@xyo-network/sdk-base-nodejs'
import { XyoGraphQlEndpoint } from './graphql/graohql-delegate'
import { PluginResolver } from './plugin-resolver'
import { XyoMutexHandler } from './mutex'
import commander from 'commander'
import { resolve } from 'path'
import { PluginsWizard } from './wizard/choose-plugin-wizard'
import { execSync } from 'child_process'
import fsExtra from 'fs-extra'
import os from 'os'
import globalModules from 'global-modules'

const configPath = `${os.homedir()}/.config/xyo`
const configName = 'xyo.json'
const defaultConfigPath = `${configPath}/${configName}`

const defaultConfig: IXyoConfig = {
  port: 11001,
  remote: [],
  plugins: [
    {
      packageName: 'base-graphql-types',
      path: '../dist/plugins/base-graphql-types',
      config: {
        name: 'unknown',
        ip: 'localhost'
      }
    },
    {
      packageName: 'file-origin-state',
      path: '../dist/plugins/origin-state',
      config: {}
    },
  ]
}

export class App extends XyoBase {
  public async main() {
    commander.option('-a, --addPluginPath <string>', 'install plugin by path')
    commander.option('-d, --removePluginPath <string>', 'remove plugin by name')
    commander.option('-i, --addRepositoryPath <string>', 'install repository by path')
    commander.option('-c, --config', 'config file override path')
    commander.option('-m, --remoteInstall', 'installs remote plugins')
    commander.option('-o, --remoteInstallAll', 'installs remote plugins no prompt')
    commander.option('-l, --list', 'lists plugin')
    commander.option('-r, --run', 'runs node')
    commander.parse(process.argv)

    await this.makeConfigIfNotExist()

    this.logInfo(`Using config at path: ${commander.config || defaultConfigPath}`)

    if (commander.list) { await this.listCommand(); return }
    if (commander.remoteInstallAll) { await this.addRemoteRepositoriesCommand(true); return }
    if (commander.remoteInstall) { await this.addRemoteRepositoriesCommand(false); return }
    if (commander.addPluginPath) { await this.installCommand(); return }
    if (commander.addRepositoryPath) { await this.addRepositoryCommand(); return }
    if (commander.run) { await this.runCommand(); return }
    if (commander.removePluginPath) { await this.removePlugin(); return }

    commander.outputHelp()
  }

  private async addRemoteRepositoriesCommand(installAll: boolean) {
    const config = await this.readConfigFromPath(commander.config || defaultConfigPath)

    for (const repo of config.remote) {
      await this.addRemoteRepository(repo, installAll)
    }
  }

  private async addRemoteRepository(remote: IXyoRemoteConfig, installAll: boolean = false) {
    try {
      execSync(`npm install ${remote.name}@${remote.version} -g`).toString('utf8')

      await this.addRepository(`${globalModules}/${remote.name}`, installAll)
    } catch (e) {
      console.log(e)
      process.exit(1)
    }
  }

  private async makeConfigIfNotExist() {
    fsExtra.ensureDirSync(configPath)

    if (!fsExtra.existsSync(defaultConfigPath) && !commander.config) {
      fsExtra.writeFileSync(defaultConfigPath, JSON.stringify(defaultConfig))
    }
  }

  private async runCommand() {
    const delegate = new XyoGraphQlEndpoint()
    const mutex = new XyoMutexHandler()
    const resolver = new PluginResolver(delegate, mutex)
    const config = await this.readConfigFromPath(commander.config || defaultConfigPath)
    const plugins = await this.getPluginsFromConfig(config)
    await resolver.resolve(plugins)
    const server = delegate.start(config.port)
    server.start()
  }

  private async removePlugin() {
    const config = await this.readConfigFromPath(commander.config || defaultConfigPath)
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
    this.logInfo(`Adding repository: ${commander.addRepositoryPath}`)
    this.addRepository(resolve(commander.addRepositoryPath))
  }

  private async addRepository(path: string, installAll: boolean = false) {
    try {
      const repositoryPath = path
      const repository = require(`${repositoryPath}/package.json`)
      const pluginPaths = repository.xyoPlugins as string[]
      const plugins: IXyoPlugin[] = []

      for (const pluginPath of pluginPaths) {
        const plugin = this.getSinglePlugin(`${repositoryPath}/${pluginPath}`)
        plugins.push(plugin)
      }

      const allPlugins = plugins.map(plugin => plugin.getName())
      const wizard = new PluginsWizard(allPlugins)

      const pluginsToInstall = installAll ? allPlugins : await wizard.start()

      for (const pluginToInstall of pluginsToInstall) {
        for (const i in plugins) {
          if (pluginToInstall === plugins[i].getName()) {
            await this.addPlugin(plugins[i], `${repositoryPath}/${pluginPaths[i]}`)
          }
        }
      }

    } catch (error) {
      this.logError(`Can not find repository ${path}`)
    }
  }

  private async addPlugin(plugin: IXyoPlugin, path: string) {
    const config = await this.readConfigFromPath(commander.config || defaultConfigPath)

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
    this.logInfo(`Installing plugin: ${commander.addPluginPath}`)

    const plugin = this.getSinglePlugin(commander.addPluginPath)

    await this.addPlugin(plugin, commander.addPluginPath)

    this.logInfo(`Installed plugin: ${commander.addPluginPath}`)
  }

  private async listCommand() {
    this.listPluginsInConfig()
    return
  }

  private async listPluginsInConfig() {
    const config = await this.readConfigFromPath(commander.config || defaultConfigPath)

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
    } catch (error) {
      console.log(error)
      this.logError(`Can not find plugin: ${path}`)
      throw new Error(`Can not find plugin: ${path}`)
    }
  }

  private saveConfig(config: IXyoConfig) {
    fsExtra.writeFileSync(defaultConfigPath, JSON.stringify(config))
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
