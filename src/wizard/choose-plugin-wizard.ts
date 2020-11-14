import { Wizard } from './base'

export class PluginsWizard extends Wizard {
  private chooseValues: string[]

  constructor(chooseValues: string[]) {
    super()

    this.chooseValues = chooseValues
  }

  public getQuestions() {
    return [
      {
        choices: this.chooseValues.map((name) => {
          return {
            name,
          }
        }),
        initial: true,
        message: 'Which plugins do you want to install?',
        name: 'components',
        type: 'multiselect',
      },
    ]
  }

  public async start(): Promise<string[]> {
    const { components } = await this.prompt<{ components: string[] }>(this.getQuestions())

    return components
  }
}
