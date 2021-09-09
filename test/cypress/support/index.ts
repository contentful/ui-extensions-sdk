/// <reference types="cypress" />

import { configure } from '@testing-library/dom'

import './commands'
require('cypress-terminal-report/src/installLogsCollector')()

configure({ testIdAttribute: 'data-test-id' })

Cypress.on('uncaught:exception', (error, runnable) => {
  console.log('Found an uncaught error')
  console.log(error)
  console.log(runnable)
  //return false
})
