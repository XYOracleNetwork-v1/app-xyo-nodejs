import { Wizard } from "./base"
import dns from 'dns'
import { validateMultiAddress } from "../validator"

export class BootstrapWizard extends Wizard {

  public async start(): Promise<string[]> {
    const bootstrapNodes: string[] = []
    const { confirmAddBootstrapNodes } = await this.prompt<{
      confirmAddBootstrapNodes: boolean
    }>({
      type: 'confirm',
      name: 'confirmAddBootstrapNodes',
      message: 'Do you want to add bootstrap nodes?',
      initial: true,
    })

    if (!confirmAddBootstrapNodes) return bootstrapNodes

    const dnsResults: string[] = await new Promise((resolve, reject) => {
      dns.lookup('peers.xyo.network', { all: true }, (err, results) => {
        if (err) return []
        return resolve(
          results.map((r) => {
            return `/ip4/${r.address}/tcp/11500`
          }),
        )
      })
    })

    if (dnsResults.length) {
      const { choices } = await this.prompt<{ choices: string[] }>({
        type: 'multiselect',
        name: 'choices',
        message:
          'These addresses were found on the `peers.xyo.network` DNS record.' +
          'You can select and deselect each address by pressing spacebar',
        choices: dnsResults,
        initial: dnsResults,
      })

      bootstrapNodes.push(...choices)
    }

    await this.getMultiAddrEntry(bootstrapNodes)

    // Returns the unique keys
    return Object.keys(
      bootstrapNodes.reduce((memo: { [s: string]: boolean }, k) => {
        memo[k] = true
        return memo
      }, {}),
    )
  }

  private async getMultiAddrEntry(
    bootstrapNodes: string[],
  ): Promise<void> {
    const { confirmAddIndividualIps } = await this.prompt<{
      confirmAddIndividualIps: boolean
    }>({
      type: 'confirm',
      name: 'confirmAddIndividualIps',
      message: 'Do you want to add any more individual bootstrap nodes?',
      initial: false,
    })

    if (!confirmAddIndividualIps) return

    // @ts-ignore
    const { ipAddress } = await this.prompt<{ ipAddress: string }>({
      type: 'input',
      message: `What is the address value of the bootstrap node? Should look something like /ip4/127.0.0.1/tcp/11500`,
      name: 'ipAddress',
      validate: this.validate(validateMultiAddress),
    })

    bootstrapNodes.push(ipAddress)
    await this.getMultiAddrEntry(bootstrapNodes)
  }
}
