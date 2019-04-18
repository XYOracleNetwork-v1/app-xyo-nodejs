/*
 * File: applauncher.ts
 * Project: @xyo-network/app
 * File Created: Tuesday, 16th April 2019 9:19:05 am
 * Author: XYO Development Team (support@xyo.network)
 * -----
 * Last Modified: Tuesday, 16th April 2019 9:54:47 am
 * Modified By: XYO Development Team (support@xyo.network>)
 * -----
 * Copyright 2017 - 2019 XY - The Persistent Company
 */

import { XyoBase } from '@xyo-network/base'
import { IAppConfig, IEthCryptoKeys } from './@types'
import path from 'path'
import {
  ProcessManager,
  fileExists,
  readFile,
  writeFile,
  createDirectoryIfNotExists,
} from '@xyo-network/utils'
import { AppWizard } from './wizard'
import * as yaml from 'js-yaml'
import {
  validateConfigFile,
  validatePassword,
  promptValidator,
} from './validator/validator'
import { prompt } from 'enquirer'

import { XyoError } from '@xyo-network/errors'
import { CatalogueItem } from '@xyo-network/network'
import { IXyoComponentFeatureResponse } from '@xyo-network/node-network'
import { XyoNode } from '@xyo-network/base-node'
import { XyoCryptoProvider } from '@xyo-network/crypto'

export class XyoAppLauncher extends XyoBase {
  public config: IAppConfig | undefined
  public yamlConfig: string | undefined
  public startNode = true

  private password?: string
  private isForever = false
  private isDiviner = false
  private isArchivist = false
  private origins = 1

  private rootPath = path.resolve(__dirname, '..')
  private configFolder = path.resolve(this.rootPath, 'config')

  public setForeverPass(pass: string) {
    this.password = pass
    this.isForever = true
  }
  public async initialize({ configName, database = "mysql" }: {configName?: string, database: string}) {
    let writeConfigFile = false

    if (configName) {
      this.logInfo(`Configuration name: ${configName}`)
      const configPath = path.resolve(this.configFolder, `${configName}.yaml`)

      const exists = await this.loadConfigFile(configPath)
      if (!exists) {
        if (this.isForever) {
          throw new XyoError(`Config file not found running forever`)
        }
        this.logInfo(`Could not find a configuration file at ${configPath}`)
        writeConfigFile = await this.showWizard(configName)
      }
    } else {
      this.logInfo(`No configuration passed in`)
      writeConfigFile = await this.showWizard()
    }

    if (!this.config) {
      this.logInfo(`Config not set`)
      return
    }

    const { validates, message } = await validateConfigFile(this.config)
    if (!validates) {
      throw new XyoError(
        `There was an error in your config file ${message}. Exiting`,
      )
    }

    if (writeConfigFile) {
      await this.writeConfigFile(await this.getSafeConfigFile(), this.config)
    }
  }

  public async start() {
    if (!this.config) throw new XyoError(`Config not initialized`)

    const nodeData = path.resolve(this.config.data, this.config.name)
    this.isArchivist = Boolean(this.config.archivist)
    this.isDiviner = Boolean(this.config.diviner)

    if (!this.isArchivist && !this.isDiviner) {
      throw new XyoError(
        `Must support at least archivist or diviner functionality`,
      )
    }

    const features: IXyoComponentFeatureResponse = {}

    if (this.isArchivist && this.config.graphqlPort && this.config.serverPort) {
      features.archivist = {
        featureType: 'archivist',
        supportsFeature: true,
        featureOptions: {
          origins: this.config.origins || 1,
          graphqlHost: this.config.ip,
          graphqlPort: this.config.graphqlPort,
          boundWitnessHost: this.config.ip,
          boundWitnessPort: this.config.serverPort,
        },
      }
    }

    if (this.isDiviner) {
      features.diviner = {
        featureType: 'diviner',
        supportsFeature: true,
        featureOptions: {},
      }
    }
    await this.addPidToPidsFolder()
    const newNode = await this.createNode(nodeData, features)
    if (newNode) {
      const managedProcessNode = new ProcessManager(newNode)
      managedProcessNode.manage(process)
    } else {
      throw new XyoError('Failed to Create Node')
    }
  }

  private async createNode(
    nodeData: string,
    features: IXyoComponentFeatureResponse,
  ) {
    if (this.config) {
      return new XyoNode({
        config: {
          nodeRunnerDelegates: {
            enableBoundWitnessServer: Boolean(this.config.serverPort),
            enableGraphQLServer: Boolean(
              this.config.graphqlPort && this.config.apis.length > 0,
            ),
            enableQuestionsWorker: this.isDiviner,
            enableBlockProducer: this.isDiviner,
            enableBlockWitness: this.isDiviner,
          },
          blockProducer: this.isDiviner
            ? {
              accountAddress: this.config.diviner!.ethereum.account.address,
            }
            : null,
          data: {
            path: nodeData,
          },
          discovery: {
            bootstrapNodes: this.config.bootstrapNodes,
            publicKey: this.config.name,
            address: `/ip4/${this.config.ip}/tcp/${this.config.p2pPort}`,
          },
          peerTransport: {
            address: `/ip4/${this.config.ip}/tcp/${this.config.p2pPort}`,
          },
          nodeNetworkFrom: {
            features,
            shouldServiceBlockPermissionRequests: this.isArchivist,
          },
          network: this.config.serverPort
            ? {
              port: this.config.serverPort,
            }
            : null,
          originChainRepository: {
            data: path.resolve(nodeData, 'origin-chain'),
          },
          networkProcedureCatalogue: {
            catalogue: [
              CatalogueItem.BOUND_WITNESS,
              CatalogueItem.TAKE_ORIGIN_CHAIN,
              CatalogueItem.GIVE_ORIGIN_CHAIN,
              CatalogueItem.TAKE_REQUESTED_BLOCKS,
              CatalogueItem.GIVE_REQUESTED_BLOCKS,
            ],
          },
          archivistRepository: this.getArchivistRepositoryConfig(),
          boundWitnessValidator: this.getBoundWitnessValidatorConfig(),
          aboutMeService: this.getAboutMeConfig(),
          graphql: this.getGraphQlConfig(),
          web3Service: await this.getWeb3ServiceConfig(),
          contentAddressableService: {
            host: this.config.ipfs.host,
            port: this.config.ipfs.port,
            protocol: this.config.ipfs.protocol,
          },
          transactionRepository: {
            data: path.resolve(nodeData, 'transactions'),
          },
        },
      })
    }
  }

  private getBoundWitnessValidatorConfig() {
    return {
      checkPartyLengths: true,
      checkIndexExists: true,
      checkCountOfSignaturesMatchPublicKeysCount: true,
      validateSignatures: true,
      validateHash: true,
    }
  }

  private getArchivistRepositoryConfig() {
    if (this.config) {
      return this.config.archivist
        ? this.config.archivist.repository
        : null
    }
  }

  private getAboutMeConfig() {
    if (this.config) {
      return {
        ip: this.config.ip,
        boundWitnessServerPort: this.config.serverPort,
        graphqlPort: this.config.graphqlPort,
        version: '0.23.0',
        name: this.config.name,
      }
    }
  }

  private getGraphQlConfig() {
    if (this.config) {
      return this.config.graphqlPort && this.config.apis.length > 0
        ? {
          port: this.config.graphqlPort,
          apis: {
            about: this.config.apis.includes('about'),
            blockByHash: this.config.apis.includes('blockByHash'),
            entities: this.config.apis.includes('entities'),
            blockList: this.config.apis.includes('blockList'),
            blocksByPublicKey: this.config.apis.includes('blocksByPublicKey'),
            intersections: this.config.apis.includes('intersections'),
            transactionList: this.config.apis.includes('transactionList'),
          },
        }
        : null
    }
  }

  private async getWeb3ServiceConfig() {
    return this.isDiviner && this.config && this.config.diviner
      ? {
        host: this.config.diviner.ethereum.host,
        address: this.config.diviner.ethereum.account.address,
        privateKey: this.config.diviner.ethereum.account.privateKey
            ? this.config.diviner.ethereum.account.privateKey
            : await this.decryptPrivateKey(
                this.config.diviner.ethereum.account,
              ),
        contracts: this.config.diviner.ethereum.contracts,
      }
      : null
  }

  private async showWizard(configName?: string) {
    const res = await new AppWizard(this.rootPath).createConfiguration(
      configName,
    )
    this.config = (res && res.config) || undefined
    this.startNode = Boolean(res && res.startNode)
    return true
  }

  private async decryptPrivateKey(crypto: IEthCryptoKeys): Promise<string> {
    if (!crypto.encryptedKey || !crypto.salt) {
      throw new Error(
        'No private ethereum key saved in configuration, run setup again',
      )
    }
    const provider = new XyoCryptoProvider()
    let tryAgain = false

    // password passed in start command
    if (!this.password) {
      tryAgain = true
      // @ts-ignore
      const { password } = await prompt<{ password }>({
        type: 'input',
        name: 'password',
        message: 'What is your Diviner password?',
        validate: promptValidator(validatePassword),
      })
      this.password = password
    }

    try {
      const privateKey = provider.decrypt(
        this.password!,
        crypto.encryptedKey,
        crypto.salt,
      )
      return privateKey
    } catch (e) {
      this.logError(`Incorrect password,  try again.`, e)
      if (!tryAgain) {
        process.exit(1)
      }
    }
    return this.decryptPrivateKey(crypto)
  }

  private async addPidToPidsFolder() {
    try {
      const pidFolder = path.resolve(__dirname, '..', 'pids')
      await createDirectoryIfNotExists(pidFolder)
      await writeFile(
        path.resolve(pidFolder, `${this.config!.name}.pid`),
        process.pid,
        { encoding: 'utf8' },
      )
    } catch (e) {
      this.logError(`There was an updating the pids folder`, e)
      throw e
    }
  }

  private async getSafeConfigFile() {
    return yaml.safeDump(JSON.parse(JSON.stringify(this.config)))
  }

  private async loadConfigFile(configPath: string) {
    const exists = await fileExists(configPath)
    if (exists) {
      this.logInfo(`Found config file at ${configPath}`)
      const file = await readFile(configPath, 'utf8')
      this.yamlConfig = file
      this.config = yaml.safeLoad(file) as IAppConfig
    }
    return exists
  }

  private async writeConfigFile(
    yamlStr: string,
    config: IAppConfig,
  ): Promise<void> {
    await createDirectoryIfNotExists(this.configFolder)
    const pathToWrite = path.resolve(this.configFolder, `${config.name}.yaml`)
    await writeFile(pathToWrite, yamlStr, 'utf8')
    return
  }
}
