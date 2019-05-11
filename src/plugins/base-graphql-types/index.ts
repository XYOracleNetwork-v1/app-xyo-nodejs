import { IXyoPlugin, IXyoGraphQlDelegate } from '@xyo-network/sdk-base-nodejs'
import { XyoAboutMeResolver } from './about-me-resolver'
import { types } from './base-graphql-types'
import { XyoOriginState } from '@xyo-network/sdk-core-nodejs'
import dotenvExpand from 'dotenv-expand'
import bs58 from 'bs58'

const getVersion = (): string => {
  dotenvExpand({
    parsed: {
      APP_VERSION:'$npm_package_version',
      APP_NAME:'$npm_package_name'
    }
  })

  return process.env.APP_VERSION || 'Unknown'
}

export class XyoBaseGraphQlPlugin implements IXyoPlugin {
  public BASE_GRAPHQL_TYPES = types

  public getName(): string {
    return 'xyo-base-graphql'
  }

  public getProvides(): string[] {
    return ['BASE_GRAPHQL_TYPES']
  }

  public getPluginDependencies(): string[] {
    return ['ORIGIN_STATE']
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    if (!graphql) {
      throw new Error('Expecting GraphQl interface')
    }

    const publicKey =  bs58.encode((deps.ORIGIN_STATE as XyoOriginState).getSigners()[0].getPublicKey().getAll().getContentsCopy())

    graphql.addType(types)
    graphql.addQuery('about: XyoAboutMe')
    graphql.addResolver('about', new XyoAboutMeResolver({
      version: getVersion(),
      ip: config.ip,
      name: config.name,
      address: publicKey,
      boundWitnessServerPort: '' // we put this as an empty string because it is deprecated
    }))

    return true
  }
}

module.exports = new XyoBaseGraphQlPlugin()
