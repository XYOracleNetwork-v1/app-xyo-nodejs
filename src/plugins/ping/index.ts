import { IXyoPlugin, IXyoGraphQlDelegate } from '../../@types'
import { IXyoDataResolver } from '../../graphql'
import { GraphQLResolveInfo } from 'graphql'

const aboutMeType = `
    type Ping {
        ping: String
    }
`

export class XyoPingPlugin implements IXyoPlugin {
  public getName(): string {
    return 'ping'
  }

  public getProvides(): string[] {
    return ['ping']
  }

  public getPluginDependencies(): string[] {
    return []
  }

  public async initialize(deps: { [key: string]: any; }, config: any, graphql?: IXyoGraphQlDelegate | undefined): Promise<boolean> {
    if (!graphql) {
      throw new Error('Expecting GraphQl interface')
    }

    const resolver: IXyoDataResolver<any, any, any, any>  = {
      async resolve(obj: any, args: any, context: any, info: GraphQLResolveInfo): Promise<any> {
        return {
          ping: 'Pong'
        }
      }
    }

    graphql.addType(aboutMeType)
    graphql.addQuery('ping: Ping')
    graphql.addResolver('ping', resolver)
    return true
  }
}

module.exports = new XyoPingPlugin()
