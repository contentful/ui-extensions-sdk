'use strict';

function Dispatcher(window, iframeId) {
  this.window = window;
  this.iframeId = iframeId;
}

Dispatcher.prototype.send = function (label, data) {
  this.window.parent.postMessage({
    label: label,
    iframeId: this.iframeId,
    data: data || {}
  }, 'http://app.joistio.com:8888');
};

module.exports = {
  create: function (window, iframeId) {
    this.dispatcher = new Dispatcher(window, iframeId);
    return this.dispatcher;
  },

  get: function () {
    return this.dispatcher;
  }
};
