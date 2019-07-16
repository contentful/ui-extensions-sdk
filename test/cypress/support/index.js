import './commands'
import 'cypress-plugin-retries'

import { configure } from '@testing-library/dom'
configure({ testIdAttribute: 'data-test-id' })
