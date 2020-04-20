import * as LocalTypes from './lib/types'
import _locations from './lib/locations'

declare module 'contentful-ui-extensions-sdk' {
  export type BaseExtensionSDK = LocalTypes.BaseExtensionSDK

  export type EditorExtensionSDK = LocalTypes.EditorExtensionSDK

  export type SidebarExtensionSDK = LocalTypes.SidebarExtensionSDK

  export type FieldExtensionSDK = LocalTypes.FieldExtensionSDK

  export type DialogExtensionSDK = LocalTypes.DialogExtensionSDK

  export type PageExtensionSDK = LocalTypes.PageExtensionSDK

  export type AppExtensionSDK = LocalTypes.AppExtensionSDK

  export type KnownSDK = LocalTypes.KnownSDK

  export const init: <T extends KnownSDK = KnownSDK>(initCallback: (sdk: T) => any) => void

  export const locations: typeof _locations
}
