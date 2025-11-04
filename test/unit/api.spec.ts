import { makeDOM, mockMutationObserver, expect, mockResizeObserver } from '../helpers'

import createAPI from '../../lib/api'
import locations from '../../lib/locations'
import { AgentAppSDK, ConfigAppSDK, ConnectMessage } from '../../lib/types'
import { mockRelease, mockReleaseWithoutEntities } from '../mocks/releases'
import { baseConnectMessage, connectMessageWithAgent } from '../mocks/connectMessage'
import { mockAgentContext, mockAgentContextMinimal } from '../mocks/agent'

const sharedExpected = [
  'location',
  'user',
  'parameters',
  'locales',
  'space',
  'dialogs',
  'navigator',
  'notifier',
  'ids',
  'access',
  'cmaAdapter',
  'hostnames',
  'cma',
  'release',
  'uiLanguageLocale',
]

function test(expected: string[], location: string | undefined, expectedLocation = location) {
  const channel = { addHandler: () => {} } as any

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
      direction: 'DIRECTION',
    },
    contentType: 'CONTENT TYPE',
    entry: { sys: 'EID' },
    fieldInfo: [],
    field: { id: 'fid' },
    editor: {
      editorInterface: {
        controls: [],
        sidebar: [],
        sys: {},
      },
    },
    ids: {
      extension: 'my-test-id',
    },
    uiLanguageLocale: 'en-US',
  } as unknown as ConnectMessage

  const dom = makeDOM()
  mockMutationObserver(dom, () => {})
  mockResizeObserver(dom, () => {})

  const api = createAPI(channel, data, dom.window as any as Window)

  // Test location-specific API.
  expect(api).to.have.all.keys(sharedExpected.concat(expected))

  // Test simple but nested properties of the shared API.
  expect(api.locales).to.have.all.keys([
    'available',
    'default',
    'names',
    'fallbacks',
    'optional',
    'direction',
  ])
  expect(api.notifier).to.have.all.keys(['success', 'error', 'warning'])
  expect(api.access).to.have.all.keys(['can', 'canEditAppConfig'])

  // Test location methods (currently only `is`).
  expect(Object.keys(api.location)).to.deep.equal(['is'])
  expect(api.location.is(expectedLocation as string)).to.equal(true)
  expect(api.location.is('wat?')).to.equal(false)

  // Test UI language locale
  expect(api.uiLanguageLocale).to.equal('en-US')

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

  it('returns correct shape of the home API (home)', () => {
    const expected = []

    test(expected, locations.LOCATION_HOME)
  })

  it('returns correct shape of the page API (page)', () => {
    const expected = []

    test(expected, locations.LOCATION_PAGE)
  })

  it('returns correct shape of the app API (app)', () => {
    const expected = ['app']

    const api = test(expected, locations.LOCATION_APP_CONFIG) as unknown as ConfigAppSDK

    expect(api.app).to.have.all.keys([
      'setReady',
      'isInstalled',
      'getParameters',
      'getCurrentState',
      'onConfigure',
      'onConfigurationCompleted',
    ])
  })

  it('returns correct shape of the agent API (agent)', () => {
    const expected = ['agent']
    const channel = { addHandler: () => {} } as any

    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})

    const api = createAPI(
      channel,
      connectMessageWithAgent,
      dom.window as any as Window,
    ) as unknown as AgentAppSDK

    expect(api).to.have.all.keys(sharedExpected.concat(expected))
    expect(api.agent).to.have.all.keys(['onContextChange'])
    expect(api.agent.onContextChange).to.be.a('function')
  })
})

describe('Release functionality in SDK', () => {
  const channel = { addHandler: () => {} } as any

  it('should include release property when provided in ConnectMessage', () => {
    const connectMessageWithRelease = {
      ...baseConnectMessage,
      release: mockRelease,
    }

    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})
    const api = createAPI(channel, connectMessageWithRelease, dom.window as any)

    expect(api.release).to.not.equal(undefined)
    expect((api.release as any)!.title).to.equal('Test Release')
    expect(api.release!.sys.id).to.equal('test-release-id')
    expect((api.release as any)!.description).to.equal('A test release for validation')
    expect((api.release as any)!.entities.items).to.have.length(2)
  })

  it('should have undefined release property when not provided in ConnectMessage', () => {
    const connectMessageWithoutRelease = {
      ...baseConnectMessage,
      // no release property
    }

    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})
    const api = createAPI(channel, connectMessageWithoutRelease, dom.window as any)

    expect(api.release).to.equal(undefined)
  })

  it('should preserve all release metadata when provided', () => {
    const connectMessageWithRelease = {
      ...baseConnectMessage,
      release: mockRelease,
    }

    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})
    const api = createAPI(channel, connectMessageWithRelease, dom.window as any)

    // Verify sys metadata
    expect(api.release!.sys.type).to.equal('Release')
    expect(api.release!.sys.version).to.equal(1)
    expect(api.release!.sys.space.sys.id).to.equal('test-space')
    expect(api.release!.sys.environment.sys.id).to.equal('master')
    expect(api.release!.sys.createdAt).to.be.a('string')

    // Verify entities structure
    expect((api.release as any)!.entities.sys.type).to.equal('Array')
    expect((api.release as any)!.entities.items[0].sys.linkType).to.equal('Entry')
    expect((api.release as any)!.entities.items[0].sys.id).to.equal('entry-1')
    expect((api.release as any)!.entities.items[1].sys.linkType).to.equal('Asset')
    expect((api.release as any)!.entities.items[1].sys.id).to.equal('asset-1')
  })

  it('should work with empty release (no entities)', () => {
    const connectMessageWithEmptyRelease = {
      ...baseConnectMessage,
      release: mockReleaseWithoutEntities,
    }

    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})
    const api = createAPI(channel, connectMessageWithEmptyRelease, dom.window as any)

    expect(api.release).to.not.equal(undefined)
    expect((api.release as any)!.title).to.equal('Empty Release')
    expect(api.release!.sys.id).to.equal('empty-release-id')
    expect((api.release as any)!.entities.items).to.have.length(0)
  })

  it('should work across ALL SDK locations when release is provided', () => {
    const allLocations = [
      'entry-field',
      'entry-field-sidebar',
      'entry-sidebar',
      'entry-editor',
      'dialog',
      'page',
      'home',
      'app-config',
    ]

    allLocations.forEach((location) => {
      const connectMessage = {
        ...baseConnectMessage,
        location,
        release: mockRelease,
      }

      const dom = makeDOM()
      mockMutationObserver(dom, () => {})
      mockResizeObserver(dom, () => {})
      const api = createAPI(channel, connectMessage, dom.window as any)

      expect(api.release, `Release should be available in ${location} location`).to.not.equal(
        undefined,
      )
      expect((api.release as any)!.title).to.equal('Test Release')
    })
  })

  it('should have undefined release in all locations when not provided', () => {
    const allLocations = [
      'entry-field',
      'entry-field-sidebar',
      'entry-sidebar',
      'entry-editor',
      'dialog',
      'page',
      'home',
      'app-config',
    ]

    allLocations.forEach((location) => {
      const connectMessage = {
        ...baseConnectMessage,
        location,
        // no release property
      }

      const dom = makeDOM()
      mockMutationObserver(dom, () => {})
      mockResizeObserver(dom, () => {})
      const api = createAPI(channel, connectMessage, dom.window as any)

      expect(
        api.release,
        `Release should be undefined in ${location} location when not provided`,
      ).to.equal(undefined)
    })
  })
})

describe('Agent functionality in SDK', () => {
  const channel = { addHandler: () => {} } as any

  it('should include agent property when provided in ConnectMessage for agent location', () => {
    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})
    const api = createAPI(channel, connectMessageWithAgent, dom.window as any) as AgentAppSDK

    expect(api.agent).to.not.equal(undefined)
    expect(api.agent.onContextChange).to.be.a('function')
  })

  it('should not include agent property when location is not agent', () => {
    const connectMessageWithoutAgent = {
      ...baseConnectMessage,
      location: 'entry-field',
      // no agent property
    }

    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})
    const api = createAPI(channel, connectMessageWithoutAgent, dom.window as any)

    expect((api as any).agent).to.equal(undefined)
  })

  it('should provide agent API with context when agent location is used', () => {
    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})
    const api = createAPI(channel, connectMessageWithAgent, dom.window as any) as AgentAppSDK

    expect(api.agent).to.not.equal(undefined)
    expect(api.agent.onContextChange).to.be.a('function')

    // Test that the handler gets called with initial context
    let receivedContext: any
    api.agent.onContextChange((context) => {
      receivedContext = context
    })

    expect(receivedContext).to.deep.equal(mockAgentContext)
  })

  it('should handle agent location with minimal metadata', () => {
    const connectMessage = {
      ...baseConnectMessage,
      location: 'agent',
      agent: mockAgentContextMinimal,
    }

    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})
    const api = createAPI(channel, connectMessage, dom.window as any) as AgentAppSDK

    expect(api.agent).to.not.equal(undefined)

    let receivedContext: any
    api.agent.onContextChange((context) => {
      receivedContext = context
    })

    expect(receivedContext.view).to.equal('home')
    expect(receivedContext.metadata).to.deep.equal({})
  })

  it('should throw error when agent context is not provided for agent location', () => {
    const connectMessage = {
      ...baseConnectMessage,
      location: 'agent',
      // no agent property - this should cause an error
    }

    const dom = makeDOM()
    mockMutationObserver(dom, () => {})
    mockResizeObserver(dom, () => {})

    expect(() => {
      createAPI(channel, connectMessage, dom.window as any)
    }).to.throw('Context data is required')
  })
})
