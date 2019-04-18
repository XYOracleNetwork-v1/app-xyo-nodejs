import { Wizard } from "./base"

export class CreateConfigWizard extends Wizard {

  public async start(): Promise<boolean> {
  // @ts-ignore
    const { confirmWizard } = await this.prompt<{ confirmWizard: boolean }>({
      initial: true,
      type: 'confirm',
      message: `No config found, would you like to create one now?`,
      name: 'confirmWizard',
    })

    return confirmWizard
  }
}
