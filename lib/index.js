const createInitializer = require('./initialize')
const createAPI = require('./api')

module.exports = { init: createInitializer(window, createAPI) }
