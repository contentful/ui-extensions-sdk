const { makeDOM, mockMutationObserver, expect } = require('../helpers')

const createAPI = require('../../lib/api')
const locations = require('../../lib/locations')

const sharedExpected = [
  'location',
  'user',
  'parameters',
  'locales',
  'space',
  'dialogs',
  'navigator',
  'window',
  'notifier'
]

function test (expected, location, expectedLocation) {
  expectedLocation = expectedLocation || location

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
  expect(api).to.have.all.keys(sharedExpected.concat(expected))

  // Test simple but nested properties of the shared API.
  expect(api.locales).to.have.all.keys(['available', 'default', 'names'])
  expect(api.notifier).to.have.all.keys(['success', 'error'])

  // Test location methods (currently only `is`).
  expect(Object.keys(api.location)).to.deep.equal(['is'])
  expect(api.location.is(expectedLocation)).to.equal(true)
  expect(api.location.is('wat?')).to.equal(false)
}

describe('createAPI()', () => {
  it('returns correct shape of the default API (entry-field and entry-field-sidebar)', () => {
    const expected = ['contentType', 'entry', 'field']

    // No location, `entry-field` is the default.
    test(expected, undefined, locations.LOCATION_ENTRY_FIELD)

    // `entry-field` provided explicitly.
    test(expected, locations.LOCATION_ENTRY_FIELD)

    // Legacy sidebar extension, has the `entry-field` API.
    test(expected, locations.LOCATION_ENTRY_FIELD_SIDEBAR)
  })

  it('returns correct shape of the sidebar API (entry-sidebar)', () => {
    const expected = ['contentType', 'entry']

    test(expected, locations.LOCATION_ENTRY_SIDEBAR)
  })

  it('returns correct shape of the entry editor API', () => {
    const expected = ['contentType', 'entry']

    test(expected, locations.LOCATION_ENTRY_EDITOR)
  })

  it('returns correct shape of the dialog API (dialog)', () => {
    const expected = ['close']

    test(expected, locations.LOCATION_DIALOG)
  })
})
