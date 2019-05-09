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
import commander from 'commander'
import { XyoMutexHandler } from './mutex'

export class App extends XyoBase {
  public async main() {

    commander.option('-c, --config <string>', 'config path')
    commander.parse(process.argv)

    if (!commander.config) {
      this.logError('No config file specified')
      process.exit(1)
    }

    const delegate = new XyoGraphQlEndpoint()
    const mutex = new XyoMutexHandler()
    const resolver = new PluginResolver(delegate, mutex)
    const config = await this.readConfigFromPath(commander.config)
    const plugins = await this.getPluginsFromConfig(config)
    await resolver.resolve(plugins)
    const server = delegate.start(config.port)
    server.start()

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

    return foundPlugins
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
