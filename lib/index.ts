import createInitializer from './initialize'
import createAPI from './api'
import { KnownSDK } from './types/index'

export * from './types/index'
export { default as locations } from './locations'

type Init = <T extends KnownSDK = KnownSDK>(
  initCallback: (sdk: T) => any,
  options?: { supressIframeWarning?: boolean }
) => void

export const init = createInitializer(window, createAPI) as Init
