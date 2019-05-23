import { IXyoDataResolver } from '../../graphql'
import { GraphQLResolveInfo } from 'graphql'

export interface IXyoAboutMe {
  name: string,
  version: string,
  ip: string,
  address: string,
  getIndex: () => number,

  // this is deprecated
  boundWitnessServerPort: string
}

export class XyoAboutMeResolver implements IXyoDataResolver<any, any, any, any>  {
  private aboutMe: IXyoAboutMe

  constructor(aboutMe: IXyoAboutMe) {
    this.aboutMe = aboutMe
  }

  public async resolve(obj: any, args: any, context: any, info: GraphQLResolveInfo): Promise<any> {
    return {
      name: this.aboutMe.name,
      version: this.aboutMe.version,
      ip: this.aboutMe.ip,
      address: this.aboutMe.address,
      index: this.aboutMe.getIndex()
    }
  }
}
