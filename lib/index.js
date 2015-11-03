'use strict';
/**
 * This module is included by widgets and provides an API for communication with
 * the parent page.
*/
(function (window) {

var createParentMessageHandler = require('./createParentMessageHandler');
window.addEventListener('message', createParentMessageHandler(window), false);

}(window));
