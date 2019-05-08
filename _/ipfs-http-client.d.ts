/*
 * File: ipfs-http-client.d.ts
 * Project: @xyo-network/app-xyo-nodejs
 * File Created: Tuesday, 23rd April 2019 6:38:39 pm
 * Author: XYO Development Team (support@xyo.network)
 * -----
 * Last Modified: Tuesday, 23rd April 2019 6:40:32 pm
 * Modified By: XYO Development Team (support@xyo.network>)
 * -----
 * Copyright 2017 - 2019 XY - The Persistent Company
 */

declare module 'ipfs-http-client' {
  export interface IIpfsInitializationOptions {
    host: string,
    port: string,
    protocol: string
  }
}