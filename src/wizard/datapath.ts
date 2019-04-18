import { Wizard } from "./base"
import { validateDataPath } from "../validator"

export class DataPathWizard extends Wizard {

  private initial: string

  constructor(initial: string) {
    super()
    this.initial = initial
  }

  public async start(): Promise<string> {
    // @ts-ignore
    const { dataPath } = await this.prompt<{ dataPath: string }>({
      initial: this.initial,
      type: 'input',
      message: 'Where would you like to store your data?',
      name: 'dataPath',
      validate: this.validate(validateDataPath),
    })

    return dataPath
  }
}
