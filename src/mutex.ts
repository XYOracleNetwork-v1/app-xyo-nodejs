import { IXyoBoundWitnessMutexDelegate } from '@xyo-network/sdk-base-nodejs'

export class XyoMutexHandler implements IXyoBoundWitnessMutexDelegate {
  private someoneHasMutex = false

  public acquireMutex(): boolean {
    if (this.someoneHasMutex) {
      return false
    }

    this.someoneHasMutex = true
    return true
  }

  public releaseMutex(): boolean {
    this.someoneHasMutex = false
    return this.someoneHasMutex
  }
}
