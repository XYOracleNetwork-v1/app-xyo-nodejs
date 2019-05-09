import { IXyoGraphQlDelegate } from '../@types'
import { XyoGraphQLServer } from './graphql-server'

export class XyoGraphQlEndpoint implements IXyoGraphQlDelegate {
  private types: string[] = []
  private queries: string[] = []

  // tslint:disable-next-line:prefer-array-literal
  private resolvers: Array<{query: string, resolver: any}> = []

  public addType(type: string): void {
    this.types.push(type)
  }

  public addQuery(queryString: string): void {
    this.queries.push(queryString)
  }

  public addResolver(query: string, resolver: any): void {
    this.resolvers.push({ query, resolver })
  }

  public start(port: number): XyoGraphQLServer {
    const schema = this.createSchema()
    const server = new XyoGraphQLServer(schema, port)

    this.resolvers.forEach((resolver) => {
      server.addQueryResolver(resolver.query, resolver.resolver)
    })

    return server
  }

  private createSchema(): string {
    return `
    scalar JSON

    type Query {
        ${this.queries.join('\n  ')}
    }

    ${this.types.join('\n\n')}
    `
  }
}
