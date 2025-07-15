import {
  sinon,
  expect,
  describeAttachHandlerMember,
  describeChannelCallingMethod,
  makeDOM,
  mockMutationObserver,
  mockResizeObserver,
} from '../helpers'

import createEntry from '../../lib/entry'
import createAPI from '../../lib/api'
import { EntryAPI, EntryFieldInfo } from '../../lib/types'
import { mockRelease, mockReleaseWithoutEntities } from '../mocks/releases'
import { baseConnectMessage } from '../mocks/connectMessage'

describe('createEntry()', () => {
  describe('returned "entry" object', () => {
    const entryData = { sys: {} }
    const fieldInfo = [
      {
        id: 'field1',
        locales: ['en-US'],
        values: {},
      },
      {
        id: 'field2',
        locales: ['en-US'],
        values: {},
      },
      {
        id: 'field3',
        locales: ['en-US'],
        values: {},
      },
    ] as EntryFieldInfo[]

    let createEntryFieldSpy: any
    let channelStub: any
    let entry: EntryAPI
    beforeEach(() => {
      createEntryFieldSpy = sinon.spy()
      channelStub = {
        addHandler: sinon.spy(),
      }

      entry = createEntry(channelStub, entryData, fieldInfo, createEntryFieldSpy)
    })

    it('subscribed to injected Channel\'s "sysChanged"', () => {
      const spy = channelStub.addHandler
      expect(spy).to.have.been.calledWithExactly('sysChanged', sinon.match.func)
    })

    describe('.fields[id]', () => {
      it('exists for each constructor given field info', () => {
        const fieldIds = fieldInfo.map((info) => info.id)
        expect(Object.getOwnPropertyNames(entry.fields)).to.deep.equal(fieldIds)
      })

      it('got instantiated with its related constructor given field info', () => {
        Object.getOwnPropertyNames(entry.fields).forEach((fieldId) => {
          const info = fieldInfo.reduce((acc: any, info) => {
            if (acc === false) {
              return info.id === fieldId ? info : false
            } else {
              return acc
            }
          }, false)

          const field = entry.fields[fieldId]
          const fieldInstantiationCall = createEntryFieldSpy.withArgs(info).firstCall

          expect(fieldInstantiationCall).to.have.been.calledOn(field)
        })
      })
    })

    describe('entry methods', () => {
      describe('calls task API methods', () => {
        ;['getTasks', 'getTask', 'createTask', 'updateTask', 'deleteTask'].forEach((methodName) => {
          const args = ['foo', 42, {}]
          describeChannelCallingMethod({
            creator: (channel) => createEntry(channel, {}, [], () => ({})),
            methodName,
            channelMethod: 'callEntryMethod',
            args,
            expectedCallArgs: [methodName, args],
          })
        })
      })
    })

    describe('.getSys()', () => {
      it('returns entryData.sys given to constructor', () => {
        expect(entry.getSys()).to.equal(entryData.sys)
      })
    })

    describe('.onSysChanged(handler)', () => {
      describeAttachHandlerMember('default behaviour', () => {
        return entry.onSysChanged(() => {})
      })

      it('calls handler immediately on attach with initial value of sys', () => {
        const spy = sinon.spy()

        entry.onSysChanged(spy)
        sinon.assert.calledOnce(spy)
        sinon.assert.calledWithExactly(spy, entryData.sys)
      })
    })

    describe('injected channel propagating "sysChanged"', () => {
      it('replaces current sys with the given one', () => {
        const newSys = {}
        // The handler registered with channel.addHandler("sysChanged", handler)
        const sysChangedHandler = channelStub.addHandler.args[0][1]
        sysChangedHandler(newSys)
        expect(entry.getSys()).to.equal(newSys)
      })
    })

    describe('.metadata', () => {
      it('should add a metadata field to the entry if passed in from web app', () => {
        // original entry should not have metadata
        expect(entry.metadata).to.be.equal(undefined)

        // add metadata to entry
        const metadata = { tags: [] }
        entry = createEntry(channelStub, { ...entryData, metadata }, fieldInfo, createEntryFieldSpy)

        expect(entry.metadata).to.equal(metadata)
      })
    })
  })
})

describe('Release functionality in entry contexts', () => {
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

  it('should work across entry-related SDK locations when release is provided', () => {
    const entryRelatedLocations = [
      'entry-field',
      'entry-field-sidebar',
      'entry-sidebar',
      'entry-editor',
    ]

    entryRelatedLocations.forEach((location) => {
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

  it('should not have release property in non-entry locations', () => {
    const nonEntryLocations = ['dialog', 'page', 'home', 'app-config']

    nonEntryLocations.forEach((location) => {
      const connectMessage = {
        ...baseConnectMessage,
        location,
        release: mockRelease, // Even if provided in ConnectMessage
      }

      const dom = makeDOM()
      mockMutationObserver(dom, () => {})
      mockResizeObserver(dom, () => {})
      const api = createAPI(channel, connectMessage, dom.window as any)

      expect(api.release, `Release should NOT be available in ${location} location`).to.equal(
        undefined,
      )
    })
  })
})
