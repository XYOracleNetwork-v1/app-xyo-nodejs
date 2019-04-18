import { Wizard } from "./base"
import { validatePort } from '../validator'
import { PortWizard } from "./port"

export class GraphqlWizard extends Wizard {

  public async start(): Promise<number | undefined> {
  // @ts-ignore
    const { confirmGraphQL } = await this.prompt<{ confirmGraphQL: boolean }>({
      initial: true,
      type: 'confirm',
      message: `Do you want your node to have a GraphQL server`,
      name: 'confirmGraphQL',
    })

    if (!confirmGraphQL) {
      return undefined
    }

    return new PortWizard('What port should your GraphQL server run on?', 11001).start()
  }
}
