/* eslint-disable require-await */
/*
 * File: index.ts
 * Project: @xyo-network/app
 * File Created: Tuesday, 16th April 2019 9:19:05 am
 * Author: XYO Development Team (support@xyo.network)
 * -----
 * Last Modified: Friday, 13th November 2020 5:51:28 pm
 * Modified By: XYO Development Team (support@xyo.network>)
 * -----
 * Copyright 2017 - 2019 XY - The Persistent Company
 */

import { IXyoPluginWithConfig, XyoBase } from '@xyo-network/sdk-base-nodejs'
import commander from 'commander'
import fs from 'fs'
import http from 'http'
import https from 'https'
import os from 'os'
import { Transform } from 'stream'

import { XyoGraphQlEndpoint } from './graphql/graohql-delegate'
import { XyoMutexHandler } from './mutex'
import { XyoPackageManager } from './package-manager'
import { PluginResolver } from './plugin-resolver'

const configPath = `${os.homedir()}/.config/xyo`
const configName = 'xyo.json'
const defaultConfigPath = `${configPath}/${configName}`

const defaultPlugins: IXyoPluginWithConfig[] = [
  {
    config: {
      ip: 'localhost',
      name: 'unknown',
    },
    plugin: require('./plugins/base-graphql-types'),
  },
  {
    config: {},
    plugin: require('./plugins/origin-state'),
  },
]

const run = async (manager: XyoPackageManager) => {
  const config = await manager.getConfig()
  defaultPlugins[0].config.name = (config as any).name || 'unknown'
  const delegate = new XyoGraphQlEndpoint(config)
  const mutex = new XyoMutexHandler()
  const resolver = new PluginResolver(delegate, mutex)
  const plugins = (await manager.resolve()).concat(defaultPlugins)
  await resolver.resolve(plugins)
  const server = delegate.start(config.port)
  server.start()
  return
}

export class App extends XyoBase {
  public async main() {
    commander.option('-i, --install', 'installs the plugins')
    commander.option('-r, --run', 'runs node')
    commander.option('-f, --fetch <string>', 'fetch from url')
    commander.parse(process.argv)

    const manager = new XyoPackageManager(commander.config || defaultConfigPath)

    await manager.makeConfigIfNotExist()

    this.logInfo(`Using config at path: ${commander.config || defaultConfigPath}`)

    if (commander.install) {
      manager.install()
      return
    }

    if (commander.run) {
      return await run(manager)
    }

    if (commander.fetch) {
      this.fetch()
      return
    }

    commander.outputHelp()
  }

  private async fetch() {
    console.log(`Downloading... ${commander.fetch}`)
    const url = commander.fetch as string

    const handler = (response: any) => {
      const data = new Transform()

      response.on('data', (chunk: any) => {
        data.push(chunk)
      })

      response.on('end', () => {
        fs.writeFileSync(commander.config || defaultConfigPath, data.read())
        this.logInfo(`Saved to ${commander.config || defaultConfigPath}`)
      })
    }

    if (url.split(':')[0] === 'http') {
      http.request(url, handler).end()
      return
    }

    if (url.split(':')[0] === 'https') {
      https.request(url, handler).end()
    }
  }
}
