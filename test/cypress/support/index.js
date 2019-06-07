import './commands'
import '@testing-library/cypress/add-commands'

import { configure } from '@testing-library/dom'
configure({ testIdAttribute: 'data-test-id' })
