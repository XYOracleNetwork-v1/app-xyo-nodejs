import { IXyoPlugin } from '@xyo-network/sdk-base-nodejs'
import { XyoOriginState, XyoFileOriginStateRepository, XyoSecp2556k1 } from '@xyo-network/sdk-core-nodejs'

interface IXyoOriginStateConfig {
  path?: string,
}

export class OriginStatePlugin implements IXyoPlugin {
  public ORIGIN_STATE: XyoOriginState | undefined

  public getName(): string {
    return 'file-origin-state'
  }

  public getProvides(): string[] {
    return ['ORIGIN_STATE']
  }

  public getPluginDependencies(): string[] {
    return []
  }

  public async initialize(deps: { [key: string]: any; }, config: any): Promise<boolean> {
    const stateConfig = config as IXyoOriginStateConfig
    const repository = new XyoFileOriginStateRepository(stateConfig.path || './state.json')

    await repository.restore((privateKey) => {
      return new XyoSecp2556k1(privateKey)
    })

    this.ORIGIN_STATE = new XyoOriginState(repository)

    return true
  }
}

module.exports = new OriginStatePlugin()
