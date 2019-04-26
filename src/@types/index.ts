/*
 * @Author: XY | The Findables Company <xyo-network>
 * @Date:   Friday, 15th February 2019 4:57:38 pm
 * @Email:  developer@xyfindables.com
 * @Filename: index.ts
 * @Last modified time: Wednesday, 6th March 2019 4:04:48 pm
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import { IArchivistRepositoryConfig } from '@xyo-network/sdk-archivist-nodejs'

export interface IEthCryptoKeys {
  address: string
  privateKey?: string
  encryptedKey?: string
  salt?: string
}
export interface ICreateConfigResult {
  startNode: boolean
  config: IAppConfig
}

export interface IArchivistConfig {
  repository: IArchivistRepositoryConfig
}

export interface IDivinerConfig {
  ethereum: {
    host: string
    account: IEthCryptoKeys
    contracts: {
      [s: string]: {
        ipfsHash: string
        address: string
      }
    }
  }
}

export interface IIpfsConfig {
  host: string
  port: number
  protocol: string
}

export interface IAppConfig {
  ip: string
  p2pPort: number
  serverPort?: number
  data: string
  name: string
  graphqlPort?: number
  apis: string[]
  bootstrapNodes: string[]
  archivist?: IArchivistConfig,
  diviner?: IDivinerConfig,
  ipfs: IIpfsConfig,
  origins?: number
}
export interface IEthContractAddressIPFS {
  ipfsHash: string
  address: string
}
