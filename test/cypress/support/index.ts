/// <reference types="cypress" />

import { configure } from '@testing-library/dom'

import './commands'

configure({ testIdAttribute: 'data-test-id' })

Cypress.on('uncaught:exception', (error: Error) => {
  const { name, message, ...details } = error
  console.log("An unexpected exception has been thrown in your app's code.")
  console.error({
    name,
    message,
    details,
  })
})
