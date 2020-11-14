import { IXyoPlugin, IXyoPluginDelegate } from '@xyo-network/sdk-base-nodejs'
import { XyoOriginState } from '@xyo-network/sdk-core-nodejs'
import bs58 from 'bs58'
import dotenvExpand from 'dotenv-expand'

import { XyoAboutMeResolver } from './about-me-resolver'
import { types } from './base-graphql-types'

const getVersion = (): string => {
  dotenvExpand({
    parsed: {
      APP_NAME: '$npm_package_name',
      APP_VERSION: '$npm_package_version',
    },
  })

  return process.env.APP_VERSION || 'Unknown'
}

export class XyoBaseGraphQlPlugin implements IXyoPlugin {
  public BASE_GRAPHQL_TYPES = types

  public getName(): string {
    return 'base-graphql-types'
  }

  public getProvides(): string[] {
    return ['BASE_GRAPHQL_TYPES']
  }

  public getPluginDependencies(): string[] {
    return ['ORIGIN_STATE']
  }

  // eslint-disable-next-line require-await
  public async initialize(delegate: IXyoPluginDelegate): Promise<boolean> {
    const originState = delegate.deps.ORIGIN_STATE as XyoOriginState

    const publicKey = bs58.encode(originState.getSigners()[0].getPublicKey().getAll().getContentsCopy())

    delegate.graphql.addType(types)
    delegate.graphql.addQuery('about: XyoAboutMe')
    delegate.graphql.addResolver(
      'about',
      new XyoAboutMeResolver({
        address: publicKey,
        boundWitnessServerPort: '',
        getIndex: () => {
          return originState.getIndexAsNumber()
        },
        ip: delegate.config.ip,
        name: delegate.config.name,
        version: getVersion(), // we put this as an empty string because it is deprecated
      })
    )

    return true
  }
}

module.exports = new XyoBaseGraphQlPlugin()
