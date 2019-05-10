import { Wizard } from './base'
import enquirer from 'enquirer'

export class PluginsWizard extends Wizard {
  private chooseValues: string[]

  constructor(chooseValues: string[]) {
    super()

    this.chooseValues = chooseValues
  }

  public async start(): Promise<string[]> {
    const { components } = await this.prompt<{ components: string[] }>({
      initial: true,
      type: 'multiselect',
      choices: this.chooseValues.map((name) => {
        return {
          name,
        }
      }),
      message: 'Which plugins do you want to install?',
      name: 'components',
    })

    return components
  }
}
