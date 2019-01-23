const { makeDOM, mockMutationObserver, expect } = require('../helpers')

const createAPI = require('../../lib/api')

function test (expected, location) {
  const channel = { addHandler: () => {} }

  const data = {
    location,
    user: 'USER',
    parameters: 'PARAMS',
    locales: {
      available: 'AVAIL',
      default: 'DEFAULT',
      names: 'NAMES'
    },
    contentType: 'CONTENT TYPE',
    entry: { sys: 'EID' },
    fieldInfo: [],
    field: { id: 'fid' }
  }

  const dom = makeDOM()
  mockMutationObserver(dom, () => {})

  const api = createAPI(channel, data, dom.window)

  // Test location-specific API.
  expect(api).to.have.all.keys(expected)

  // Test simple but nested properties of the shared API.
  expect(api.locales).to.have.all.keys(['available', 'default', 'names'])
  expect(api.notifier).to.have.all.keys(['success', 'error'])
}

describe('createAPI()', () => {
  it('returns correct shape of the default API (entry-field)', () => {
    const expected = [
      'user',
      'parameters',
      'locales',
      'contentType',
      'entry',
      'field',
      'space',
      'dialogs',
      'navigator',
      'window',
      'notifier'
    ]

    // No location, `entry-field` is the default.
    test(expected)

    // `entry-field` provided explicitly.
    test(expected, 'entry-field')
  })

  it('returns correct shape of the sidebar API (entry-sidebar)', () => {
    const expected = [
      'user',
      'parameters',
      'locales',
      'contentType',
      'entry',
      'space',
      'dialogs',
      'navigator',
      'window',
      'notifier'
    ]

    test(expected, 'entry-sidebar')
  })
})
