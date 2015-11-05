function Dispatcher (window, iframeId, origin) {
  this.window = window
  this.iframeId = iframeId
  this.origin = origin
}

Dispatcher.prototype.send = function (label, data) {
  this.window.parent.postMessage({
    label: label,
    iframeId: this.iframeId,
    data: data || {}
  }, this.origin)
}

module.exports = {
  create: function (window, iframeId, origin) {
    this.dispatcher = new Dispatcher(window, iframeId, origin)
    return this.dispatcher
  },

  get: function () {
    return this.dispatcher
  }
}
