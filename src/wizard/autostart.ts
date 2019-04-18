import { Wizard } from "./base"

export class AutostartWizard extends Wizard {

  public async start(): Promise<boolean> {
    const { start } = await this.prompt<{ start: boolean }>({
      message: 'Do you want to start the node after configuration is complete?',
      initial: true,
      type: 'confirm',
      name: 'start',
    })

    return start
  }
}
