import { IXyoPlugin, IXyoGraphQlDelegate } from '../../@types'
import { IXyoDataResolver } from '../../graphql'
import { XyoAboutMeResolver, IXyoAboutMe } from './about-me-resolver'
import dotenvExpand from 'dotenv-expand'

const aboutMeType = `
    type XyoAboutMe {
        name: String,
        version: String,
        ip: String,
    }
`

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
  public getName(): string {
    return 'xyo-base-graphql'
  }

  public getProvides(): string[] {
    return ['xyo-base-graphql']
  }

  public getPluginDependencies(): string[] {
    return []
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    if (!graphql) {
      throw new Error('Expecting GraphQl interface')
    }

    graphql.addType(aboutMeType)
    graphql.addQuery('about: XyoAboutMe')
    graphql.addResolver('about', new XyoAboutMeResolver({
      version: getVersion(),
      ip: config.ip,
      name: config.name
    }))
    return true
  }
}

module.exports = new XyoBaseGraphQlPlugin()
