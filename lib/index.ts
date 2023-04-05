import { createInitializer } from './initialize'
import createAPI from './api'
import { KnownAppSDK } from './types'

export * from './types'
export { default as locations } from './locations'

type Init = <T extends KnownAppSDK = KnownAppSDK>(
  initCallback: (sdk: T) => any,
  options?: { supressIframeWarning?: boolean }
) => void

export const init = createInitializer(globalThis, createAPI) as Init
