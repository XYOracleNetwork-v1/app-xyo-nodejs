/* eslint-disable @typescript-eslint/no-unused-vars */
import { Wizard } from './base'
import enquirer from 'enquirer'

export class PluginsWizard extends Wizard {
  private chooseValues: string[]

  constructor(chooseValues: string[]) {
    super()

    this.chooseValues = chooseValues
  }

  questions = [
    {
      type: 'multiselect',
      initial: true,
      choices: this.chooseValues.map(name => {
        return {
          name
        }
      }),
      message: 'Which plugins do you want to install?',
      name: 'components'
    }
  ]

  public async start(): Promise<string[]> {
    const { components } = await this.prompt<{ components: string[] }>(
      this.questions
    )

    return components
  }
}
