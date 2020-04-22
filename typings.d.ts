import * as Types from './lib/types'
import _locations from './lib/locations'

declare module 'contentful-ui-extensions-sdk' {
  export = Types

  export const init: <T extends KnownSDK = KnownSDK>(initCallback: (sdk: T) => any) => void

  export const locations: typeof _locations
}
