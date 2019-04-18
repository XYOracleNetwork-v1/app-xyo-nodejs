import { Wizard } from "./base"
import { validateURL } from "../validator"

export class EthereumNodeAddressWizard extends Wizard {

  public async start(): Promise<string> {
      // @ts-ignore
    const { ethereumNodeAddress } = await this.prompt<{ ethereumNodeAddress: string }>({
      type: 'input',
      name: 'ethereumNodeAddress',
      initial: 'http://127.0.0.1:8545',
      message: 'What is your Ethereum Node address?',
      validate: this.validate(validateURL),
    })

    return ethereumNodeAddress
  }
}
