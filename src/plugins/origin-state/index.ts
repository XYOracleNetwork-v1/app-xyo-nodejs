import { IXyoPlugin, XyoBase } from '@xyo-network/sdk-base-nodejs'
import { XyoOriginState, XyoFileOriginStateRepository, XyoSecp2556k1 } from '@xyo-network/sdk-core-nodejs'
import bs58 from 'bs58'
import fsExtra from 'fs-extra'
import os from 'os'

interface IXyoOriginStateConfig {
  path?: string,
}

export class OriginStatePlugin extends XyoBase implements IXyoPlugin {
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
    fsExtra.ensureDirSync(`${os.homedir()}/.config/xyo/`)
    const repository = new XyoFileOriginStateRepository(stateConfig.path || `${os.homedir()}/.config/xyo/state.json`)

    await repository.restore((privateKey) => {
      return new XyoSecp2556k1(privateKey)
    })

    this.ORIGIN_STATE = new XyoOriginState(repository)

    if (this.ORIGIN_STATE.getIndexAsNumber() === 0) {
      const signer = new XyoSecp2556k1()
      this.ORIGIN_STATE.addSigner(signer)
    }

    this.logInfo(`Using public key:  \u001b[35m${bs58.encode(this.ORIGIN_STATE.getSigners()[0].getPublicKey().getAll().getContentsCopy())}\u001b[0m`)

    return true
  }
}

module.exports = new OriginStatePlugin()
