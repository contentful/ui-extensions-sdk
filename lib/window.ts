import { Channel } from './channel'
import { WindowAPI } from './types'

export default function createWindow(currentWindow: Window, channel: Channel): WindowAPI {
  // We assume MutationObserver was defined by the web-app
  const { document, MutationObserver } = currentWindow as any

  const autoUpdateHeight = () => {
    self.updateHeight()
  }
  const observer = new MutationObserver(autoUpdateHeight)
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
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    })
    currentWindow.addEventListener('resize', autoUpdateHeight)
  }

  function stopAutoResizer() {
    if (!isAutoResizing) {
      return
    }
    isAutoResizing = false
    observer.disconnect()
    currentWindow.removeEventListener('resize', autoUpdateHeight)
  }

  function updateHeight(height: number | null = null) {
    if (height === null) {
      const documentHeight = Math.ceil(document.documentElement.getBoundingClientRect().height)
      const fullDocumentHeight = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      )

      if (documentHeight !== fullDocumentHeight) {
        const allAbsolutePositionedElems = document.querySelectorAll('[data-position-absolute]')

        height = allAbsolutePositionedElems.length > 0 ? fullDocumentHeight : documentHeight
      } else {
        height = documentHeight
      }
    }

    if (height !== oldHeight) {
      channel.send('setHeight', height)
      oldHeight = height
    }
  }
}
