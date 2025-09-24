import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { ConnectMessage, Metadata } from './types'
import { AssetAPI } from './types/asset.types'
import { AssetSys } from './types/utils'

export default function createAsset(
  channel: Channel,
  assetData: ConnectMessage['asset'],
): AssetAPI {
  if (!assetData) {
    throw new Error('Asset data is required')
  }

  let sys: AssetSys = assetData.sys
  const sysChanged = new MemoizedSignal<[AssetSys]>(sys)
  let metadata = assetData.metadata
  const metadataChanged = new MemoizedSignal<[Metadata | undefined]>(metadata)

  channel.addHandler('sysChanged', (newSys: AssetSys) => {
    sys = newSys
    sysChanged.dispatch(sys)
  })

  channel.addHandler('metadataChanged', (newMetadata: Metadata) => {
    metadata = newMetadata
    metadataChanged.dispatch(metadata)
  })

  return {
    getSys() {
      return sys
    },
    publish(options?: { skipUiValidation?: boolean }) {
      return channel.call<void>('callAssetMethod', 'publish', [options])
    },
    unpublish() {
      return channel.call<void>('callAssetMethod', 'unpublish')
    },
    save() {
      return channel.call<void>('callAssetMethod', 'save')
    },
    onSysChanged(handler: (sys: AssetSys) => void) {
      return sysChanged.attach(handler)
    },
    getMetadata() {
      return metadata
    },
    onMetadataChanged(handler: VoidFunction) {
      return metadataChanged.attach(handler)
    },
  }
}
