// will be appended to generated typings.d.ts
declare module 'contentful-ui-extensions-sdk' {
  export const init: <T extends KnownSDK = KnownSDK>(initCallback: (sdk: T) => any) => void

  export const locations: Locations
}
