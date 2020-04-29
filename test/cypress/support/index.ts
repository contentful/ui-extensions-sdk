/// <reference types="cypress" />

import { configure } from '@testing-library/dom'

import './commands'

configure({ testIdAttribute: 'data-test-id' })
