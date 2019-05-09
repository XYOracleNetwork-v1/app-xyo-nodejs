import { IXyoPlugin, IXyoGraphQlDelegate, IXyoPluginWithConfig } from './@types'

export class PluginResolver {

  private resolvedPluginNames: {[key: string]: boolean}  = {}
  private resolvedPlugins: {[key: string]: IXyoPlugin} = {}
  private lastResolvedPluginCount = 0
  private resolvedPluginCount = -1
  private qlDelegate: IXyoGraphQlDelegate

  constructor(graphql: IXyoGraphQlDelegate) {
    this.qlDelegate = graphql
  }

  public async resolve(plugins: IXyoPluginWithConfig[]) {

    // while we are still resolving plugins
    while (this.lastResolvedPluginCount !== this.resolvedPluginCount) {
      this.lastResolvedPluginCount = this.resolvedPluginCount

      // loop through the plugins to try to resolve one
      for (const plugin of plugins) {

        // if we have not resolved this plugin, do not try to resolve again
        if (!this.resolvedPluginNames[plugin.plugin.getName()]) {
          await this.resolveSinglePlugin(plugin)
        }
      }

    }
  }

  private async resolveSinglePlugin(plugin: IXyoPluginWithConfig) {
    const pluginDependencies = plugin.plugin.getPluginDependencies()
    let hasAllDependencies = true

    // loop through all of the resolved dependencies, to see if it has the dependencies
    for (const pluginDependency of pluginDependencies) {
      const resolvedPluginDependency = this.resolvedPlugins[pluginDependency]

      // if there is no dependency for the plugin, skip and return
      if (!resolvedPluginDependency) {
        hasAllDependencies = false
        break
      }
    }

    // if the plugin has all of the dependencies, initialize it
    if (hasAllDependencies) {
      await plugin.plugin.initialize(this.resolvedPlugins, plugin.config, this.qlDelegate)
      const provides = plugin.plugin.getProvides()

      // after we initialize the plugin, we add what it provides, so that other plugins can use it
      for (const provider of provides) {
        if (this.resolvedPlugins[provider]) {
          throw Error('stub duplicate dependency, pick one')
        }

        this.resolvedPlugins[provider] = plugin[provider]
        this.resolvedPluginCount++
      }

      this.resolvedPluginNames[plugin.plugin.getName()] = true
    }
  }
}
