import { Metadata } from './entities'
import { AssetSys } from './utils'

export interface AssetAPI {
  /** Returns sys for an asset. */
  getSys: () => AssetSys
  /** Publish the asset */
  publish: (options?: { skipUiValidation?: boolean }) => Promise<void>
  /** Unpublish the asset */
  unpublish: () => Promise<void>
  /** Saves the current changes of the asset */
  save: () => Promise<void>
  /** Calls the callback with sys every time that sys changes. */
  onSysChanged: (callback: (sys: AssetSys) => void) => () => void
  /**
   * Optional metadata on an asset
   * @deprecated
   */
  metadata?: Metadata
  getMetadata: () => Metadata | undefined
  onMetadataChanged: (callback: (metadata?: Metadata) => void) => VoidFunction
}
