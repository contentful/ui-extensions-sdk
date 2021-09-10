/// <reference types="cypress" />

import { configure } from '@testing-library/dom'

import './commands'
import installLogsCollector from 'cypress-terminal-report/src/installLogsCollector'

installLogsCollector()
configure({ testIdAttribute: 'data-test-id' })

// Don't fail suite in case of uncaught exceptions, but delegate to assertions
Cypress.on('uncaught:exception', () => false)
