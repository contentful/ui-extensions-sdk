import {
  sinon,
  expect,
  describeAttachHandlerMember,
  describeChannelCallingMethod,
} from '../helpers'

import createEntry from '../../lib/entry'
import { EntryAPI, EntryFieldInfo, Release } from '../../lib/types'

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

    describe('in release context', () => {
      const release = { sys: { id: 'release-id', type: 'Release' } } as Release
      let releaseEntry: EntryAPI
      let releaseChannelStub: any
      let releaseCreateEntryFieldSpy: any

      beforeEach(() => {
        releaseCreateEntryFieldSpy = sinon.spy()
        releaseChannelStub = {
          addHandler: sinon.spy(),
          call: sinon.spy(),
        }

        releaseEntry = createEntry(
          releaseChannelStub,
          entryData,
          fieldInfo,
          releaseCreateEntryFieldSpy,
          release,
        )
      })

      it('still returns the sys object', () => {
        expect(releaseEntry.getSys()).to.equal(entryData.sys)
      })

      it('throws an error when calling publish', () => {
        expect(() => releaseEntry.publish()).to.throw(
          'SDK method "publish" is not supported in release context',
        )
        expect(releaseChannelStub.call).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })

      it('throws an error when calling unpublish', () => {
        expect(() => releaseEntry.unpublish()).to.throw(
          'SDK method "unpublish" is not supported in release context',
        )
        expect(releaseChannelStub.call).to.not.have.been.called // eslint-disable-line no-unused-expressions
      })

      it('allows save method to work normally', () => {
        releaseEntry.save()
        expect(releaseChannelStub.call).to.have.been.calledOnce // eslint-disable-line no-unused-expressions
        expect(releaseChannelStub.call).to.have.been.calledWith('callEntryMethod', 'save')
      })
    })
  })
})
