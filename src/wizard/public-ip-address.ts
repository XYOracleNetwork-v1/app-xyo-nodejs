import { Wizard } from "./base"
import { validateIpAddress } from "../validator"

export class PublicIpAddressWizard extends Wizard {

  public async start(): Promise<string> {
    // @ts-ignore
    const { ipAddress } = await this.prompt<{ ipAddress: string }>({
      initial: '0.0.0.0',
      type: 'input',
      message: `What is your public ip address?`,
      name: 'ipAddress',
      validate: this.validate(validateIpAddress),
    })

    return ipAddress
  }
}
