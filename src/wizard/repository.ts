import { Wizard } from "./base"

export enum XyoRepository {
  MYSQL = 'mysql',
  LEVEL = 'level',
  NEO4J = 'neo4j',
  DYNAMO = 'dynamo',
}

export class RepositoryWizard extends Wizard {

  public async start(): Promise<XyoRepository[]> {
    const { components } = await this.prompt<{ components: string }>({
      initial: true,
      type: 'select',
      choices: [
        XyoRepository.MYSQL,
        XyoRepository.LEVEL,
        XyoRepository.NEO4J,
        XyoRepository.DYNAMO,
      ],
      message: `What type of repository?`,
      name: 'repository',
    })

    // @ts-ignore
    const xyoComponents: XyoComponent[] = []

    if (components.includes(XyoRepository.MYSQL)) {
      xyoComponents.push(XyoRepository.MYSQL)
    }

    if (components.includes(XyoRepository.LEVEL)) {
      xyoComponents.push(XyoRepository.LEVEL)
    }

    if (components.includes(XyoRepository.NEO4J)) {
      xyoComponents.push(XyoRepository.NEO4J)
    }

    return xyoComponents
  }
}
