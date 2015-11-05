var Promise = require('es6-promise').Promise
var fieldsCollection = require('./fieldsCollection')
var parentMessageDispatcher = require('./parentMessageDispatcher')
var requestPromises = require('./requestPromises').get()
var messageDispatcher

/**
* params
* - fields
* - fieldId
* - widgetParams
*/
module.exports = function createApi (params) {
  messageDispatcher = parentMessageDispatcher.get()
  var api = {
    fields: fieldsCollection.create({fields: params.fields, locales: params.locales}),
    currentFieldLocale: params.fieldLocale,
    defaultLocale: params.defaultLocale,
    locales: params.locales,
    space: createSpaceApi(),
    dialog: createDialogApi(),
    window: createWindowApi()
  }
  if (!params.inDialog) {
    api.widgetParams = params.widgetParams
    api.field = fieldsCollection.createCurrentField({
      field: api.fields.get(params.fieldApiName),
      fieldLocale: params.fieldLocale,
      locales: params.locales
    })
  }
  return api
}

function createSpaceApi () {
  var spaceApi = {}
  ;[
    'getEntry',
    'getAsset',
    'getContentType',
    'getEntries',
    'getAssets',
    'getContentTypes',
    'createEntry',
    'createAsset',
    'createContentType'
  ].forEach(function (method) {
    spaceApi[method] = createSpaceMethod(method)
  })
  return spaceApi
}

function createSpaceMethod (method) {
  return function (/* ...arguments */) {
    return createParentMessagePromise('callMethodOnSpace', {
      method: method,
      args: Array.prototype.slice.call(arguments)
    })
  }
}

function createDialogApi () {
  return {
    open: function (params) {
      return createParentMessagePromise('openDialog', params)
    },
    confirm: function (value) {
      messageDispatcher.send('confirmDialog', value)
    },
    cancel: function (value) {
      messageDispatcher.send('closeDialog', value)
    },
    setState: function (value) {
      messageDispatcher.send('setDialogState', value)
    }
  }
}


var currentSize = {height: 0, width: 0}
var body = window.document.body

function createWindowApi () {
  return {
    setSize: function (width, height) {
      messageDispatcher.send('setIframeSize', {
        width: width,
        height: height
      })
    },

    resize: function () {
      console.log('resizing iframe', body.offsetWidth, body.offsetHeight)
      messageDispatcher.send('setIframeSize', {
        width: body.offsetWidth,
        height: body.offsetHeight
      })
    },

    setupAutoResizer: function () {
      var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function () {
          if (body.offsetHeight !== currentSize.height || body.offsetWidth !== currentSize.width) {
            console.log('auto resizing iframe', body.offsetWidth, body.offsetHeight)
            messageDispatcher.send('setIframeSize', {
              width: body.offsetWidth,
              height: body.offsetHeight
            })
          }
        })
      })
      observer.observe(body, { attributes: true, childList: true, subtree: true })
    }
  }
}


function createParentMessagePromise (messageLabel, data) {
  return new Promise(function (resolve, reject) {
    data.requestId = messageLabel + '-' + Math.ceil(Math.random() * 1e8)
    messageDispatcher.send(messageLabel, data)
    requestPromises.push(data.requestId, resolve, reject)
  })
}
