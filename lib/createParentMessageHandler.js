'use strict';

var parentMessageDispatcher = require('./parentMessageDispatcher');

var requestPromises = require('./requestPromises').create();
var createApi = require('./createApi');

module.exports = function createParentMessageHandler(window) {
  var _window = window;
  var api;
  var iframeId;
  var messageDispatcher;

  return function onMessageReceived(ev) {
    ensureOrigin(ev.origin);
    var data = ev.data.data;
    var message = ev.data.label;

    switch(message) {
      case 'initialize':
        iframeId = data.iframeId;
        messageDispatcher = parentMessageDispatcher.create(_window, iframeId);
        api = createApi(data);
        var event = new CustomEvent(
          'cfWidgetReady', {
            detail: api
          }
        );
        _window.dispatchEvent(event);
        messageDispatcher.send('widgetApiIsReady');
        break;

      case 'updateFieldValue':
        api.field._setValue(data);
        api.field.observers.forEach(function (fn) {
          fn(data);
        });
        break;

      case 'updateFields':
        api.fields._update(data.fields);
        api.fields.observers.forEach(function (fn) {
          fn(api.fields);
        });
        break;

      case 'returnSpaceMethodCall':
        var response = data.response;
        delete data.response;
        var error = data.error;
        delete data.error;
        var promise = requestPromises.pop(data.requestId);
        response ? promise.resolve(response) : promise.reject(error);
        break;

      case 'confirmedDialog':
        var promise = requestPromises.pop(data.requestId);
        promise.resolve(data.actionData);
        break;

      case 'closedDialog':
        var promise = requestPromises.pop(data.requestId);
        promise.reject(data.actionData);
        break;

      default:
        throw new Error('Contentful Widgets: Message '+message+' from parent page not recognized.')
    }
  };
};

function ensureOrigin(origin) {
  if(origin !== 'http://app.joistio.com:8888'){
    throw new Error('Cannot handle message from untrusted origin');
  }
}
