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

import { XyoBase, IXyoPluginWithConfig } from '@xyo-network/sdk-base-nodejs'
import { XyoGraphQlEndpoint } from './graphql/graohql-delegate'
import { PluginResolver } from './plugin-resolver'
import { XyoMutexHandler } from './mutex'
import commander from 'commander'
import os from 'os'
import { XyoPackageManager } from './package-manager'

const configPath = `${os.homedir()}/.config/xyo`
const configName = 'xyo.json'
const defaultConfigPath = `${configPath}/${configName}`

const defaultPlugins: IXyoPluginWithConfig[] = [
  {
    plugin: require('./plugins/base-graphql-types/index.js'),
    config: {
      name: 'unknown',
      ip: 'localhost'
    }
  },
  {
    plugin: require('./plugins/origin-state/index.js'),
    config: {}
  }
]

export class App extends XyoBase {

  public async main() {
    commander.option('-i, --install', 'installs the plugins')
    commander.option('-r, --run', 'runs node')
    commander.parse(process.argv)

    const manager = new XyoPackageManager(commander.config || defaultConfigPath)

    await manager.makeConfigIfNotExist()

    this.logInfo(`Using config at path: ${commander.config || defaultConfigPath}`)

    if (commander.install) {
      manager.install()
      return
    }

    if (commander.run) {
      const config = await manager.getConfig()
      const delegate = new XyoGraphQlEndpoint(config)
      const mutex = new XyoMutexHandler()
      const resolver = new PluginResolver(delegate, mutex)
      const plugins = (await manager.resolve()).concat(defaultPlugins)
      await resolver.resolve(plugins)
      const server = delegate.start(config.port)
      server.start()
      return
    }

    commander.outputHelp()
  }

}
