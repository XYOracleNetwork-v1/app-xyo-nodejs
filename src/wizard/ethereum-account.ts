import { Wizard } from "./base"
import { IEthCryptoKeys } from "../@types"
import { validateHexString, validatePassword } from "../validator"
import path from 'path'
import { createDirectoryIfNotExists, writeFile } from "@xyo-network/utils"
import { XyoCryptoProvider } from "@xyo-network/crypto"

export class EthereumAccountWizard extends Wizard {

  private nodeName: string

  constructor(nodeName: string) {
    super()
    this.nodeName = nodeName
  }

  public async start(): Promise<IEthCryptoKeys> {
  // @ts-ignore
    const { ethereumAccountAddress } = await this.prompt<{ethereumAccountAddress: string }>({
      type: 'input',
      name: 'ethereumAccountAddress',
      message: 'What is your Ethereum address? This will start with `0x`',
      validate: this.validate(validateHexString),
    })

  // @ts-ignore
    const { ethereumPrivateKey } = await this.prompt<{ ethereumPrivateKey: string }>({
      type: 'input',
      name: 'ethereumPrivateKey',
      message:
      'What is your Ethereum Private key? Diviners encrypt private keys and store encrypted copy locally.',
    })

  // @ts-ignore
    const { password } = await this.prompt<{ password: string }>({
      type: 'input',
      name: 'password',
      message: 'Please add a Diviner password.',
      validate: this.validate(validatePassword),
    })

    const rootPath = path.resolve(__dirname, '..')
    const configFolder = path.resolve(rootPath, 'config')
    await createDirectoryIfNotExists(configFolder)
    const pathToWrite = path.resolve(configFolder, `${this.nodeName}.password`)
    await writeFile(pathToWrite, password, 'utf8')

    const provider = new XyoCryptoProvider()

    const { encrypted, salt } = provider.encrypt(password, ethereumPrivateKey)
    return { salt, address: ethereumAccountAddress, encryptedKey: encrypted }
  }
}
