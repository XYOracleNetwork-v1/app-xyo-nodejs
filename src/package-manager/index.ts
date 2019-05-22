import { IXyoPluginWithConfig, XyoBase, IXyoConfig, IXyoPluginConfig, IXyoPlugin } from '@xyo-network/sdk-base-nodejs'
import globalModules from 'global-modules'
import { execSync } from 'child_process'
import { resolve } from 'path'
import fsExtra from 'fs-extra'

const defaultConfig = {
  port: 11001,
  plugins: []
}

export class XyoPackageManager extends XyoBase {
  public pathToConfig: string
  private pluginTypes: {[key: string]: (config: any) => Promise<void>} = {}
  private pluginTypeInstallers: {[key: string]: (config: any) => Promise<IXyoPluginWithConfig[]>} = {}

  constructor(pathToConfig: string) {
    super()
    this.pathToConfig = pathToConfig
    this.pluginTypes.npmRemote = npmRemotePluginResolver
    this.pluginTypes.npmLocal = npmLocalPluginResolver
    this.pluginTypes.path = pathPluginResolver

    this.pluginTypeInstallers.path = pathPluginRunner
    this.pluginTypeInstallers.npmRemote = npmRemotePluginRunner
    this.pluginTypeInstallers.npmLocal = npmLocalPluginRunner
  }

  public async install() {
    const pluginsToInstall = (await this.readConfigFromPath(this.pathToConfig)).plugins

    for (const plugin of pluginsToInstall) {
      await this.installPlugin(plugin)
    }
  }

  public async getConfig() {
    return this.readConfigFromPath(this.pathToConfig)
  }

  public async resolve(): Promise<IXyoPluginWithConfig[]> {
    const pluginsToRun = (await this.readConfigFromPath(this.pathToConfig)).plugins
    let plugins: IXyoPluginWithConfig[] = []

    for (const toRun of pluginsToRun) {
      const resolver = this.pluginTypeInstallers[toRun.type]
      plugins = plugins.concat(await resolver(toRun.config))
    }

    for (const plugin of plugins) {
      this.logInfo(`Running with plugin: ${plugin.plugin.getName()}`)
    }

    return plugins
  }

  public async makeConfigIfNotExist() {
    fsExtra.ensureDirSync(this.pathToConfig.substring(0, this.pathToConfig.lastIndexOf('/')))

    if (!fsExtra.existsSync(this.pathToConfig)) {
      fsExtra.writeFileSync(this.pathToConfig, JSON.stringify(defaultConfig))
    }
  }

  private async installPlugin(config: IXyoPluginConfig) {
    const resolver = this.pluginTypes[config.type]
    await resolver(config.config)
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

interface INpmRemoteConfig {
  packageName: string,
  version: string,
  subPlugins: INpmRemoteSubPluginConfig[]
}

interface INpmRemoteLocalConfig {
  path: string,
  subPlugins: INpmRemoteSubPluginConfig[]
}

interface INpmRemoteSubPluginConfig {
  name: string,
  config: any
}

interface IPathConfig {
  path: string,
  config: any
}

const npmRemotePluginResolver = async(config: any) => {
  execSync(`npm install ${config.packageName}@${config.version} -g`).toString('utf8')
  installNpmRepository(`${globalModules}/${config.packageName}`, config.subPlugins)
}

const npmLocalPluginResolver = async(config: any) => {
  installNpmRepository(config.path, config.subPlugins)
}

const pathPluginResolver = async(config: IPathConfig) => {
  try {
    const _ = require(config.path) as IXyoPlugin
  } catch {
    throw new Error(`Can not find plugin at path ${config.path}`)
  }
}

const installNpmRepository = (pathOfNpm: string, subPlugins: INpmRemoteSubPluginConfig[]) => {

  const xyoPlugins: string[] = require(`${pathOfNpm}/package.json`).xyoPlugins || []
  const pluginsWithConfig: IXyoPluginWithConfig[] = []
  const resolvedPlugins: {[key: string]: IXyoPlugin} = {}

  for (const pluginPath of xyoPlugins) {
    const absPath = `${pathOfNpm}/${pluginPath}`

    try {
      const plugin = require(absPath) as IXyoPlugin
      resolvedPlugins[plugin.getName()] = plugin
    } catch {
      throw new Error(`Can not find plugin at path ${absPath}`)
    }
  }

  for (const pluginShouldBeFound of subPlugins) {
    const didFind = resolvedPlugins[pluginShouldBeFound.name]

    if (!didFind) {
      throw new Error(`Can not find plugin with name ${pluginShouldBeFound.name}`)
    }

    pluginsWithConfig.push({
      plugin: didFind,
      config: pluginShouldBeFound.config,
    })
  }

  return pluginsWithConfig
}

const npmRemotePluginRunner = async(config: any) => {
  return installNpmRepository(`${globalModules}/${config.packageName}`, config.subPlugins)
}

const npmLocalPluginRunner = async(config: any) => {
  return installNpmRepository(config.path, config.subPlugins)
}

const pathPluginRunner = async(config: any) => {
  try {
    const plugin = require(config.path) as IXyoPlugin

    const pWC: IXyoPluginWithConfig = {
      plugin,
      config: config.config
    }

    return [pWC]
  } catch {
    throw new Error(`Can not find plugin at path ${config.path}`)
  }
}
