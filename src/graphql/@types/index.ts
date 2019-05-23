/*
 * @Author: XY | The Findables Company <xyo-network>
 * @Date:   Wednesday, 19th December 2018 11:19:04 am
 * @Email:  developer@xyfindables.com
 * @Filename: index.ts

 * @Last modified time: Wednesday, 19th December 2018 11:19:21 am
 * @License: All Rights Reserved
 * @Copyright: Copyright XY | The Findables Company
 */

import { GraphQLResolveInfo } from 'graphql'

export interface IXyoDataResolver <TSource, TArgs, TContext, TResult> {
  resolve(obj: TSource, args: TArgs, context: TContext, info: GraphQLResolveInfo): Promise<TResult>
}
