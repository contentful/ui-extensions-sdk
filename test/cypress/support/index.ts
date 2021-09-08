/// <reference types="cypress" />

import { configure } from '@testing-library/dom'

import './commands'

configure({ testIdAttribute: 'data-test-id' })

Cypress.on('uncaught:exception', (error: Error) => {
  console.log('An unexpected exception has been thrown in your apps code.')
  console.error(error)

  return error
})
