import { ApolloServer, gql, IResolvers } from 'apollo-server'
import { XyoBase } from '@xyo-network/sdk-base-nodejs'
import { IXyoDataResolver } from './@types'
import graphqlTypeJson from 'graphql-type-json'

export class XyoGraphQLServer extends XyoBase {
  public server: ApolloServer | undefined
  private readonly graphqlResolvers: IGraphQLResolvers = {}

  constructor(private readonly schema: string, private readonly port: number) {
    super()
  }

  public addQueryResolver<TSource, TArgs, TContext, TResult>(
    route: string,
    resolver: IXyoDataResolver<TSource, TArgs, TContext, TResult>
  ) {
    if (this.graphqlResolvers[route]) {
      throw new Error(`Route ${route} already exists. Will not add`)
    }

    this.graphqlResolvers[route] = resolver
  }

  public async start(): Promise<void> {
    const { typeDefs, resolvers } = this.initialize()
    this.server = new ApolloServer({
      typeDefs,
      resolvers,
    })

    const { url } = await this.server.listen({ port: this.port })
    this.logInfo(`Graphql server ready at url: ${url}`)
  }

  public async stop(): Promise<void> {
    this.logInfo('Stopping Graphql server')
    if (this.server) {
      await this.server.stop()
    }
    this.logInfo('Stopped Graphql server')
  }

  private initialize() {
    // Build Router
    const compiledRouter = Object.keys(this.graphqlResolvers as object).reduce((router, route) => {
      // @ts-ignore
      router[route] = (obj: any, args: any, context: any, info: any) => {
        // @ts-ignore
        return (this.graphqlResolvers[route] as IXyoDataResolver).resolve(obj, args, context, info)
      }
      return router
    },                                                                         {})

    const resolvers: IResolvers = {
      JSON: graphqlTypeJson,
      Query: compiledRouter,
      List: {
        __resolveType: () => {
          return null
        }
      }
    }

    const typeDefs = gql(this.schema)
    return { typeDefs, resolvers }
  }
}

export interface IGraphQLResolvers {
  [s: string]: IXyoDataResolver<any, any, any, any>
}
