import { IValidationResult } from '../validator'
import { prompt } from 'enquirer'

export class Wizard {

  protected prompt = prompt

  public async start(): Promise<any> {
    return {
      name: "Unknown"
    }
  }

  protected validate<T>(validator: (val: T) => Promise<IValidationResult>) {
    return async (v: T) => {
      const { validates, message } = await validator(v)
      if (validates) return true
      return message!
    }
  }
}
