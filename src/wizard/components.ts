import { Wizard } from "./base"

export enum XyoComponent {
  ARCHIVIST = 'archivist',
  DIVINER = 'diviner',
}

export class ComponentsWizard extends Wizard {

  public async start(): Promise<XyoComponent[]> {
    const { components } = await this.prompt<{ components: string }>({
      initial: true,
      type: 'select',
      choices: [
        XyoComponent.ARCHIVIST,
        XyoComponent.DIVINER,
        `${XyoComponent.ARCHIVIST} and ${XyoComponent.DIVINER}`,
      ],
      message: `Which component features do you want your Xyo Node to support?`,
      name: 'components',
    })

    // @ts-ignore
    const xyoComponents: XyoComponent[] = []

    if (components.includes(XyoComponent.ARCHIVIST)) {
      xyoComponents.push(XyoComponent.ARCHIVIST)
    }

    if (components.includes(XyoComponent.DIVINER)) {
      xyoComponents.push(XyoComponent.DIVINER)
    }

    return xyoComponents
  }
}
