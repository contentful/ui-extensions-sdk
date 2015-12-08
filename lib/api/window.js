export default function createWindow (channel) {
  var autoUpdateHeight = () => updateHeight()
  let observer = new MutationObserver(autoUpdateHeight)
  let oldHeight = null
  let isAutoResizing = false

  return {startAutoResizer, stopAutoResizer, updateHeight}

  function startAutoResizer () {
    updateHeight()
    if (isAutoResizing) {
      return
    }
    isAutoResizing = true
    observer.observe(window.document.body, {
      attributes: true, childList: true,
      subtree: true, characterData: true
    })
    window.addEventListener('resize', autoUpdateHeight)
  }

  function stopAutoResizer () {
    if (!isAutoResizing) {
      return
    }
    isAutoResizing = false
    observer.disconnect()
    window.removeEventListener('resize', autoUpdateHeight)
  }

  function updateHeight (height) {
    if (height == null) {
      height = Math.ceil(
        document.documentElement.getBoundingClientRect().height)
    }

    if (height !== oldHeight) {
      channel.send('setHeight', height)
      oldHeight = height
    }
  }
}
