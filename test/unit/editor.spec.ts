import { describeAttachHandlerMember, sinon, expect } from '../helpers'

import createEditor from '../../lib/editor'
import { Channel } from '../../lib/channel'
import { ConnectMessage, EditorInterface } from '../../lib/types'

describe('createEditor()', () => {
  const channelStub = {
    addHandler: sinon.spy(),
  } as unknown as Channel

  const editorDataMock: Exclude<ConnectMessage['editor'], undefined> = {
    localeSettings: { mode: 'multi' },
    showDisabledFields: false,
  }

  const editorInterfaceMock = {
    sidebar: [],
    controls: [],
  } as unknown as EditorInterface

  const editor = createEditor(channelStub, editorDataMock, editorInterfaceMock)

  it('should return editorInterface', () => {
    expect(editor.editorInterface).to.equal(editorInterfaceMock)
  })

  describe('.onLocaleSettingsChanged(handler)', () => {
    describeAttachHandlerMember('default behaviour', () => {
      return editor.onLocaleSettingsChanged(() => {})
    })

    it('calls cb with initial value', () => {
      const cb = sinon.stub()
      editor.onLocaleSettingsChanged(cb)
      expect(cb).to.have.been.calledWith(editorDataMock.localeSettings)
    })
  })

  describe('.onShowHiddenFieldsChanged(handler)', () => {
    describeAttachHandlerMember('default behaviour', () => {
      return editor.onShowHiddenFieldsChanged(() => {})
    })

    it('calls cb with initial value', () => {
      const cb = sinon.stub()
      editor.onShowHiddenFieldsChanged(cb)
      expect(cb).to.have.been.calledWith(editorDataMock.showDisabledFields)
    })
  })
})
