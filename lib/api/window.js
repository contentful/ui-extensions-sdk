export default function createWindow (channel) {
  let observer = new MutationObserver(() => updateHeight())
  let oldHeight = null

  return {startAutoResizer, stopAutoResizer, updateHeight}

  function startAutoResizer () {
    updateHeight()
    observer.observe(window.document.body, {
      attributes: true, childList: true,
      subtree: true, characterData: true
    })
  }

  function stopAutoResizer () {
    observer.disconnect()
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
