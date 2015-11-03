/**
 * This module is included by widgets and provides an API for communication with
 * the parent page.
 */
var createParentMessageHandler = require('./createParentMessageHandler')
window.addEventListener('message', createParentMessageHandler(window), false)
