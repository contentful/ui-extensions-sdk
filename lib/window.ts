import { Channel } from './channel'
import { WindowAPI } from './types/window.types'

export default function createWindow(currentWindow: Window, channel: Channel): WindowAPI {
  // We assume MutationObserver was defined by the web-app
  const { document, MutationObserver } = currentWindow as any

  const autoUpdateHeight = () => {
    self.updateHeight()
  }

  const heightObserverCallback = (mutations: Array<MutationRecord>) => {
    checkAbsolutePositionedElems(mutations)
    autoUpdateHeight()
  }

  const observer = new MutationObserver(heightObserverCallback)
  let oldHeight: number
  let isAutoResizing = false
  const absolutePositionedElems: Set<Node> = new Set()

  const self = { startAutoResizer, stopAutoResizer, updateHeight }
  return self

  function checkAbsolutePositionedElems(mutations: Array<MutationRecord>) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        if (mutation.target.nodeType === 1) {
          const node = mutation.target
          const computedStyle = window.getComputedStyle(node as Element)
          if (computedStyle.position === 'absolute' && computedStyle.display !== 'none') {
            absolutePositionedElems.add(node)
          } else {
            absolutePositionedElems.delete(node)
          }
        }
      } else if (mutation.type === 'childList') {
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
              const computedStyle = window.getComputedStyle(node as Element)
              if (computedStyle.position === 'absolute') absolutePositionedElems.add(node)
            }
          })
        }
        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((node) => {
            absolutePositionedElems.delete(node)
          })
        }
      }
    })
  }

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
        height = absolutePositionedElems.size > 0 ? fullDocumentHeight : documentHeight
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
