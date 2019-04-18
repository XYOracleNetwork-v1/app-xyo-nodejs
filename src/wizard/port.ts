import { Wizard } from "./base"
import { validatePort } from '../validator'

export class PortWizard extends Wizard {

  private message: string
  private initial: number

  constructor(message: string, initial: number) {
    super()
    this.message = message
    this.initial = initial
  }

  public async start(): Promise<number> {
    // @ts-ignore
    const { port } = await this.prompt<{ port: number }>({
      message: this.message,
      type: 'input',
      initial: `${this.initial}`,
      name: 'port',
      float: false,
      validate: this.validate(validatePort),
    })

    return parseInt(port, 10)
  }
}
