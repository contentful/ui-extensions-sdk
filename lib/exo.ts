import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { ExoSDK, UiMode, Unsubscribe } from './types'

/**
 * Creates the ExO SDK namespace when handshake includes `exo`; otherwise returns undefined.
 * @see EXT-7182
 */
export default function createExo(
  channel: Channel,
  exoInit?: { uiMode?: UiMode },
): ExoSDK | undefined {
  if (exoInit === undefined) {
    return undefined
  }

  const initialMode: UiMode = exoInit.uiMode ?? 'form'
  const uiModeSignal = new MemoizedSignal<[UiMode]>(initialMode)

  channel.addHandler('exo.uiModeChanged', (payload: { mode: UiMode }) => {
    uiModeSignal.dispatch(payload.mode)
  })

  return {
    getUiMode(): UiMode {
      return uiModeSignal.getMemoizedArgs()[0]
    },
    onUiModeChanged(cb: (mode: UiMode) => void): Unsubscribe {
      return uiModeSignal.attach(cb)
    },
  }
}
