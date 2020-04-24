import { configure } from '@testing-library/dom'
import 'cypress-plugin-retries'

import './commands'

configure({ testIdAttribute: 'data-test-id' })
