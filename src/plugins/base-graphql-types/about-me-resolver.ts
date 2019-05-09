import { IXyoDataResolver } from '../../graphql'
import { GraphQLResolveInfo } from 'graphql'

export interface IXyoAboutMe {
  name: string,
  version: string,
  ip: string,
}

export class XyoAboutMeResolver implements IXyoDataResolver<any, any, any, any>  {
  private aboutMe: IXyoAboutMe

  constructor(aboutMe: IXyoAboutMe) {
    this.aboutMe = aboutMe
  }

  public async resolve(obj: any, args: any, context: any, info: GraphQLResolveInfo): Promise<any> {
    return this.aboutMe
  }
}
