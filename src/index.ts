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

import { IXyoPluginWithConfig, IXyoConfig, XyoBase } from '@xyo-network/sdk-base-nodejs'
import { XyoGraphQlEndpoint } from './graphql/graohql-delegate'
import { PluginResolver } from './plugin-resolver'
import { XyoMutexHandler } from './mutex'
import commander from 'commander'
import fs from 'fs'
import { exec } from 'child_process'

const configPath =  __dirname + '/xyo.json'

const defualtConfig = {
  port: 11001,
  plugins: [
    {
      packageName: 'base-graphql-types',
      path: '../dist/plugins/base-graphql-types',
      config: {
        name: 'carter',
        ip: '10.30.10.11'
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
    commander.option('-i, --install <string>', 'install plugin')
    commander.option('-l, --list', 'lists plugin')
    commander.option('-r, --run', 'runs node')
    commander.parse(process.argv)

    if (!fs.existsSync(configPath) && !commander.config) {
      fs.writeFileSync(configPath, JSON.stringify(defualtConfig))
    }

    this.logInfo(`Using config at path: ${commander.config || configPath}`)

    if (commander.list) {
      this.listCommand()
      return
    }

    if (commander.install) {
      this.installCommand()
      return
    }

    if (commander.run) {
      this.runCommand()
      return
    }

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

  private async installCommand() {
    this.logInfo(`Installing plugin: ${commander.install}`)

    exec(`npm install ${commander.install} -g`, async(err) => {
      if (err) {
        this.logError(`Error installing plugin: ${commander.install}`)
        return
      }

      const config = await this.readConfigFromPath(commander.config || configPath)
      config.plugins.push({
        packageName: commander.install,
        config: {}
      })
      this.saveConfig(config)
      this.logInfo(`Installed plugin: ${commander.install}`)
    })
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
