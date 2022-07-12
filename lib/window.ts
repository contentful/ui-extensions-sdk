import { Channel } from './channel'
import { WindowAPI } from './types/window.types'

export default function createWindow(
  currentGlobal: typeof globalThis,
  channel: Channel
): WindowAPI {
  const { document, MutationObserver, ResizeObserver } = currentGlobal

  let oldHeight: number
  let isAutoResizing = false
  let checkAbsoluteElements = false
  const absolutePositionedElems: Set<Element> = new Set()

  const mutationObserver = new MutationObserver((mutations: Array<MutationRecord>) => {
    checkAbsolutePositionedElems(mutations)
    if (isAutoResizing) {
      self.updateHeight()
    }
  })

  const resizeObserver = new ResizeObserver(() => {
    self.updateHeight()
  })

  mutationObserver.observe(document.body, {
    attributes: true,
    childList: true,
    subtree: true,
    characterData: true,
  })

  const self = { startAutoResizer, stopAutoResizer, updateHeight }
  return self

  function checkAbsoluteElementStyle(type: MutationRecordType, element: Element) {
    const computedStyle = getComputedStyle(element)

    if (computedStyle.position !== 'absolute') {
      return false
    }

    switch (type) {
      case 'attributes':
        return computedStyle.display !== 'none'

      default:
        return true
    }
  }

  function checkAbsolutePositionedElems(mutations: Array<MutationRecord>) {
    mutations.forEach((mutation) => {
      switch (mutation.type) {
        case 'attributes':
          if (mutation.target.nodeType === Node.ELEMENT_NODE) {
            const element = mutation.target as Element
            if (checkAbsoluteElementStyle(mutation.type, element)) {
              absolutePositionedElems.add(element)
            } else {
              absolutePositionedElems.delete(element)
            }
          }
          break

        case 'childList':
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element
              if (checkAbsoluteElementStyle(mutation.type, element)) {
                absolutePositionedElems.add(element)
              }
            }
          })

          mutation.removedNodes.forEach((node) => {
            const element = node as Element
            absolutePositionedElems.delete(element)
          })
          break
      }
    })
  }

  function startAutoResizer({ absoluteElements = false } = {}) {
    checkAbsoluteElements = Boolean(absoluteElements)
    self.updateHeight()
    if (isAutoResizing) {
      return
    }
    isAutoResizing = true
    resizeObserver.observe(document.body)
  }

  function stopAutoResizer() {
    if (!isAutoResizing) {
      return
    }
    isAutoResizing = false
    resizeObserver.disconnect()
  }

  function updateHeight(height: number | null = null) {
    if (height === null) {
      const documentHeight = Math.ceil(document.documentElement.getBoundingClientRect().height)

      // Only check for absolute elements if option is provided to startAutoResizer
      if (checkAbsoluteElements && absolutePositionedElems.size) {
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
