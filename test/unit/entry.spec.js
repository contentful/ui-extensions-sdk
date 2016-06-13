import createEntry from '../../lib/api/entry'
import {
  noop,
  describeAttachHandlerMember
} from '../helpers'
import {find} from 'lodash'

describe('createEntry()', () => {
  describe('returned "entry" object', () => {
    const entryData = {sys: {}}
    const fieldInfo = [
      {
        id: 'field1',
        locales: ['en-US'],
        values: {}
      }, {
        id: 'field2',
        locales: ['en-US'],
        values: {}
      }, {
        id: 'field3',
        locales: ['en-US'],
        values: {}
      }
    ]
    const defaultLocale = 'en-US'

    let channelStub
    let FieldSpy
    let entry
    beforeEach(() => {
      FieldSpy = sinon.spy()
      createEntry.__Rewire__('Field', FieldSpy)

      channelStub = {
        addHandler: sinon.spy()
      }

      entry = createEntry(channelStub, entryData, fieldInfo, defaultLocale)
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
          const info = find(fieldInfo, (info) => info.id === fieldId)
          const field = entry.fields[fieldId]
          const fieldInstantiationCall =
                FieldSpy.withArgs(channelStub, info, defaultLocale).firstCall

          expect(fieldInstantiationCall).to.have.been.calledOn(field)
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
        return entry.onSysChanged(noop)
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
  })
})
