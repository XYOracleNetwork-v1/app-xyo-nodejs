import { XyoBase } from '@xyo-network/sdk-base-nodejs'
import { ApolloServer, gql, IResolvers } from 'apollo-server-express'
import express from 'express'
import fs from 'fs'
import graphqlTypeJson from 'graphql-type-json'
import http from 'http'
import https from 'https'

import { IXyoDataResolver } from './@types'

export class XyoGraphQLServer extends XyoBase {
  public server: ApolloServer | undefined
  private graphqlResolvers: Record<string, IXyoDataResolver<any, any, any, any>>

  constructor(private readonly schema: string, private readonly port: number, private readonly config: any) {
    super()
    this.graphqlResolvers = {}
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

  public start() {
    const app = express()

    const { typeDefs, resolvers } = this.initialize()
    this.server = new ApolloServer({
      resolvers,
      typeDefs,
    })

    const expressServer = http.createServer(app)

    if (this.config.ssl) {
      // Assumes certificates are in .ssl folder from package root. Make sure the files
      // are secured.
      const sslServer = https.createServer(
        {
          cert: fs.readFileSync(this.config.ssl.cert),
          key: fs.readFileSync(this.config.ssl.key),
        },
        app
      )

      this.server.installSubscriptionHandlers(sslServer)
      sslServer.listen(this.config.ssl.port)
    }

    this.server.graphqlPath = '/'
    this.server.applyMiddleware({ app, path: '/' })
    this.server.installSubscriptionHandlers(expressServer)

    expressServer.listen({ port: this.port })
    this.logInfo(`Graphql server ready at url: http://localhost:${this.config.port}`)
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
    const compiledRouter = Object.keys(this.graphqlResolvers).reduce<Record<string, any>>((router, route) => {
      router[route] = (obj: any, args: any, context: any, info: any) => {
        return (this.graphqlResolvers[route] as IXyoDataResolver<any, any, any, any>).resolve(obj, args, context, info)
      }
      return router
    }, {})

    const resolvers: IResolvers = {
      JSON: graphqlTypeJson,
      List: {
        __resolveType: () => {
          return null
        },
      },
      Query: compiledRouter,
    }

    const typeDefs = gql(this.schema)
    return { resolvers, typeDefs }
  }
}
