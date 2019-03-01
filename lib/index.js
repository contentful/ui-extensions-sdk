const createInitializer = require('./initialize')
const createAPI = require('./api')
const locations = require('./locations')

module.exports = {
  init: createInitializer(window, createAPI),
  locations
}
