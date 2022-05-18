import { Channel } from './channel'
import { WindowAPI } from './types'

export default function createWindow(currentWindow: Window, channel: Channel): WindowAPI {
  // We assume MutationObserver and ResizeObserver were defined by the web-app
  const { document, MutationObserver, ResizeObserver } = currentWindow as any

  const autoUpdateHeight = () => {
    self.updateHeight()
  }
  const mutationObserver = new MutationObserver(autoUpdateHeight)
  const resizeObserver = new ResizeObserver(autoUpdateHeight)
  let oldHeight: number
  let isAutoResizing = false

  const self = { startAutoResizer, stopAutoResizer, updateHeight }
  return self

  function startAutoResizer() {
    self.updateHeight()
    if (isAutoResizing) {
      return
    }
    isAutoResizing = true
    mutationObserver.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    })
    resizeObserver.observe(document.body)
  }

  function stopAutoResizer() {
    if (!isAutoResizing) {
      return
    }
    isAutoResizing = false
    mutationObserver.disconnect()
    resizeObserver.disconnect()
  }

  function updateHeight(height: number | null = null) {
    if (height === null) {
      height = Math.ceil(document.documentElement.getBoundingClientRect().height)
    }

    if (height !== oldHeight) {
      channel.send('setHeight', height)
      oldHeight = height
    }
  }
}
