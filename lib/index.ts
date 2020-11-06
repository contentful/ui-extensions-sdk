import createInitializer from './initialize'
import createAPI from './api'
import locations from './locations'

// `export = {}` to allow direct CommonJS `require()` instead of `require().default`
export = {
  init: createInitializer(window, createAPI),
  locations,
}
