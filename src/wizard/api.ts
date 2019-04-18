import { Wizard } from "./base"

export class ApiWizard extends Wizard {

  private options: string[]

  constructor(options: string[]) {
    super()
    this.options = options
  }

  public async start(): Promise<string[]> {
    const { choices } = await this.prompt<{ choices: string[] }>({
      type: 'multiselect',
      name: 'choices',
      message:
        'Which GraphQL api endpoints would you like to support? ' +
        '(use space-bar to toggle selection. Press enter once finished)',
      choices: this.options,
      initial: this.options,
    })

    return choices
  }
}
