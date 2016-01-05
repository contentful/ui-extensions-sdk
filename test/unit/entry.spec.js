import createEntry from '../../lib/api/entry'
import Field from '../../lib/api/field'
import {
  noop,
  describeAttachHandlerMember
} from '../helpers'

describe(`createEntry()`, () => {
  describe(`returned "entry" object`, () => {
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

    let channelStub
    let entry
    beforeEach(() => {
      channelStub = {
        addHandler: sinon.spy()
      }
      entry = createEntry(channelStub, entryData, fieldInfo, 'en-US')
    })

    it(`subscribed to injected Channel's "sysChanged"`, () => {
      const spy = channelStub.addHandler
      expect(spy).to.have.been.calledWithExactly('sysChanged', sinon.match.func)
    })

    describe(`.fields[id]`, () => {
      it(`is a Field with its .id==id for each constructor given fieldInfo`, () => {
        fieldInfo.forEach((info) => {
          const field = entry.fields[info.id]
          expect(field).to.be.instanceof(Field)
          expect(field.id).to.equal(info.id)
        })
      })
    })

    describe(`.getSys()`, () => {
      it(`returns entryData.sys given to constructor`, () => {
        expect(entry.getSys()).to.equal(entryData.sys)
      })
    })

    describeAttachHandlerMember(`.onSysChanged(handler)`, () => {
      return entry.onSysChanged(noop)
    })

    describe(`injected channel propagating "sysChanged"`, () => {
      it(`replaces current sys with the given one`, () => {
        const newSys = {}
        // The handler registered with channel.addHandler("sysChanged", handler)
        const sysChangedHandler = channelStub.addHandler.args[0][1]
        sysChangedHandler(newSys)
        expect(entry.getSys()).to.equal(newSys)
      })
    })
  })
})
