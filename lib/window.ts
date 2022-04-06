import { Channel } from './channel'
import { WindowAPI } from './types/window.types'

export default function createWindow(currentWindow: Window, channel: Channel): WindowAPI {
  // We assume MutationObserver was defined by the web-app
  const { document, MutationObserver } = currentWindow as any

  const autoUpdateHeight = () => {
    self.updateHeight()
  }

  const heightObserverCallback = (mutations: Array<MutationRecord>) => {
    if (checkAbsoluteElements) {
      checkAbsolutePositionedElems(mutations)
    }
    autoUpdateHeight()
  }

  const observer = new MutationObserver(heightObserverCallback)
  let oldHeight: number
  let isAutoResizing = false
  let checkAbsoluteElements = false
  const absolutePositionedElems: Set<Element> = new Set()

  const self = { startAutoResizer, stopAutoResizer, updateHeight }
  return self

  function checkAbsolutePositionedElems(mutations: Array<MutationRecord>) {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        if (mutation.target.nodeType === Node.ELEMENT_NODE) {
          const node = mutation.target as Element
          const computedStyle = window.getComputedStyle(node)
          if (computedStyle.position === 'absolute' && computedStyle.display !== 'none') {
            absolutePositionedElems.add(node)
          } else {
            absolutePositionedElems.delete(node)
          }
        }
      } else if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          const element = node as Element
          if (node.nodeType === Node.ELEMENT_NODE) {
            const computedStyle = window.getComputedStyle(element)
            if (computedStyle.position === 'absolute') absolutePositionedElems.add(element)
          }
        })
        mutation.removedNodes.forEach((node) => {
          const element = node as Element
          absolutePositionedElems.delete(element)
        })
      }
    })
  }

  function startAutoResizer({ absoluteElements = false } = {}) {
    self.updateHeight()
    checkAbsoluteElements = Boolean(absoluteElements)
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

      if (absolutePositionedElems.size) {
        let maxHeight = documentHeight
        absolutePositionedElems.forEach((element) => {
          maxHeight = Math.max(element.getBoundingClientRect().bottom, maxHeight)
        })
        height = maxHeight
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
