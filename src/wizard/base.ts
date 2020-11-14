import { prompt } from 'enquirer'

export class Wizard {
  protected prompt = prompt

  // eslint-disable-next-line require-await
  public async start(): Promise<any> {
    return {
      name: 'Unknown',
    }
  }
}
