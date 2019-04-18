import { Wizard } from "./base"

export class ActAsServerWizard extends Wizard {

  public async start(): Promise<boolean> {
    // @ts-ignore
    const { actAsServer } = await this.prompt<{ actAsServer: boolean }>({
      initial: true,
      type: 'confirm',
      message: `Do you want your node to act as a server for doing bound-witnesses?`,
      name: 'actAsServer',
    })

    return actAsServer
  }
}
