import { Wizard } from "./base"
import { validateHexString } from '../validator'

export interface IContractConfig {
  contractAddr: string,
  ipfsAddr: string
}

export class ContractWizard extends Wizard {

  private contract: string

  constructor(contract: string) {
    super()
    this.contract = contract
  }

  public async start(): Promise<IContractConfig> {
  // @ts-ignore
    const { contractAddr } = await this.prompt<{ contractAddr: string }>({
      type: 'input',
      name: 'contractAddr',
      message: `What is the ${this.contract} contract address? This will start with \`0x\``,
      validate: this.validate(validateHexString),
    })

    const { ipfsAddr } = await this.prompt<{ ipfsAddr: string }>({
      type: 'input',
      name: 'ipfsAddr',
      message: `What is the ${this.contract} IPFS address? This will start with \`Qm\``,
    })

    return { contractAddr, ipfsAddr }
  }
}
