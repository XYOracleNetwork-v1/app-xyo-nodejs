import { Wizard } from "./base"
import { validateNodeName } from "../validator"

export class NodeNameWizard extends Wizard {

  private suggest: string | undefined

  constructor(suggest?: string) {
    super()
    this.suggest = suggest
  }

  public async start(): Promise<string> {
    // @ts-ignore
    const { nodeName } = await this.prompt<{ nodeName: string }>({
      type: 'input',
      message: `What would you like to name your XYO Node?`,
      name: 'nodeName',
      initial: this.suggest,
      validate: this.validate(validateNodeName),
    })

    return nodeName
  }
}
