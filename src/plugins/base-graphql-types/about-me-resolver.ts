import { GraphQLResolveInfo } from 'graphql'

import { IXyoDataResolver } from '../../graphql'

export interface IXyoAboutMe {
  name: string
  version: string
  ip: string
  address: string
  getIndex: () => number

  // this is deprecated
  boundWitnessServerPort: string
}

export class XyoAboutMeResolver implements IXyoDataResolver<any, any, any, any> {
  private aboutMe: IXyoAboutMe

  constructor(aboutMe: IXyoAboutMe) {
    this.aboutMe = aboutMe
  }

  // eslint-disable-next-line require-await
  public async resolve(_obj: any, _args: any, _context: any, _info: GraphQLResolveInfo): Promise<any> {
    // peers field is deprecated
    // graphql port is deprecated

    return {
      address: this.aboutMe.address,
      boundWitnessServerPort: 11000,
      graphqlPort: 11001,
      index: this.aboutMe.getIndex(),
      ip: this.aboutMe.ip,
      name: this.aboutMe.name,
      peers: [],
      version: this.aboutMe.version,
    }
  }
}
