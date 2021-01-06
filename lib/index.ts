import createInitializer from './initialize'
import createAPI from './api'

export * from './types'
export { default as locations } from './locations'
export const init = createInitializer(window, createAPI)
