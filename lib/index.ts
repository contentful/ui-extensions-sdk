import createInitializer from './initialize'
import createAPI from './api'
import { ConnectMessage, KnownSDK } from './types'
import { Channel } from './channel'

export * from './types'
export { default as locations } from './locations'

type Init = <
  T extends KnownSDK = KnownSDK,
  C extends ((channel: Channel, params: ConnectMessage) => any) | undefined = undefined
>(
  initCallback: C extends Function ? (sdk: T, customSdk: ReturnType<C>) => any : (sdk: T) => any,
  options?: { makeCustomApi: C; supressIframeWarning?: boolean }
) => void

export const init = createInitializer(window, createAPI) as Init
