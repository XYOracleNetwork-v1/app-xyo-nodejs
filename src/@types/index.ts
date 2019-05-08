/*
 * @Author: XY | The Findables Company <xyo-network>
 * @Date:   Friday, 15th February 2019 4:57:38 pm
 * @Email:  developer@xyfindables.com
 * @Filename: index.ts
 * @Last modified time: Wednesday, 6th March 2019 4:04:48 pm
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

export interface IXyoPlugin {
  getName(): string
  getProvides(): string[]
  getPluginDependencies(): string[]
  initialize(deps: { [key: string]: any; }): Promise<boolean>
}
