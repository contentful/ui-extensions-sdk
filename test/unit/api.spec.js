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
  'notifier',
  'ids'
]

function test(expected, location, expectedLocation) {
  expectedLocation = expectedLocation || location

  const channel = { addHandler: () => {} }

  const data = {
    location,
    user: 'USER',
    parameters: 'PARAMS',
    locales: {
      available: 'AVAIL',
      default: 'DEFAULT',
      names: 'NAMES',
      fallbacks: 'FALLBACK',
      optional: 'OPTIONAL',
      direction: 'DIRECTION'
    },
    contentType: 'CONTENT TYPE',
    entry: { sys: 'EID' },
    fieldInfo: [],
    field: { id: 'fid' },
    editor: {
      editorInterface: {
        controls: [],
        sidebar: [],
        sys: {}
      }
    },
    ids: {
      extension: 'my-test-id'
    }
  }

  const dom = makeDOM()
  mockMutationObserver(dom, () => {})

  const api = createAPI(channel, data, dom.window)

  // Test location-specific API.
  expect(api).to.have.all.keys(sharedExpected.concat(expected))

  // Test simple but nested properties of the shared API.
  expect(api.locales).to.have.all.keys([
    'available',
    'default',
    'names',
    'fallbacks',
    'optional',
    'direction'
  ])
  expect(api.notifier).to.have.all.keys(['success', 'error'])

  // Test location methods (currently only `is`).
  expect(Object.keys(api.location)).to.deep.equal(['is'])
  expect(api.location.is(expectedLocation)).to.equal(true)
  expect(api.location.is('wat?')).to.equal(false)

  return api
}

describe('createAPI()', () => {
  it('returns correct shape of the default API (entry-field and entry-field-sidebar)', () => {
    const expected = ['contentType', 'entry', 'field', 'editor', 'window']

    // No location, `entry-field` is the default.
    test(expected, undefined, locations.LOCATION_ENTRY_FIELD)

    // `entry-field` provided explicitly.
    test(expected, locations.LOCATION_ENTRY_FIELD)

    // Legacy sidebar extension, has the `entry-field` API.
    test(expected, locations.LOCATION_ENTRY_FIELD_SIDEBAR)
  })

  it('returns correct shape of the sidebar API (entry-sidebar)', () => {
    const expected = ['contentType', 'entry', 'editor', 'window']

    test(expected, locations.LOCATION_ENTRY_SIDEBAR)
  })

  it('returns correct shape of the entry editor API (entry-editor)', () => {
    const expected = ['contentType', 'entry', 'editor']

    test(expected, locations.LOCATION_ENTRY_EDITOR)
  })

  it('returns correct shape of the dialog API (dialog)', () => {
    const expected = ['close', 'window']

    test(expected, locations.LOCATION_DIALOG)
  })

  it('returns correct shape of the app API (app)', () => {
    const expected = ['app', 'platformAlpha']

    // Test legacy `LOCATION_APP`.
    test(expected, locations.LOCATION_APP)
    // Test new `LOCATION_APP_CONFIG`.
    const api = test(expected, locations.LOCATION_APP_CONFIG)

    const appMethods = [
      'setReady',
      'isInstalled',
      'getParameters',
      'getCurrentState',
      'onConfigure',
      'onConfigurationCompleted'
    ]

    expect(api.app).to.have.all.keys(appMethods)
    expect(api.platformAlpha).to.have.all.keys(['app'])
    expect(api.platformAlpha.app).to.have.all.keys(appMethods)
  })
})
