/// <reference types="cypress" />

import { configure } from '@testing-library/dom'

import './commands'

configure({ testIdAttribute: 'data-test-id' })

Cypress.on('uncaught:exception', (error: Error) => {
  const log = Cypress.log({
    name: 'Uncaught Exception',
    message: `Uncaught ${error.name} - ${error.message}`,
    consoleProps: () => {
      const { name, message, ...details } = error

      return {
        name,
        message,
        details,
      }
    },
  })
})
