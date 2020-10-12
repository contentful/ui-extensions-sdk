import { describeAttachHandlerMember, sinon, expect } from '../helpers'

import createEditor from '../../lib/editor'

describe('createEditor()', () => {
  const channelStub: any = {
    addHandler: sinon.spy()
  }

  const editorInterfaceMock: any = {
    sidebar: [],
    controls: []
  }

  const editor = createEditor(channelStub, editorInterfaceMock)

  it('should return editorInterface', () => {
    expect(editor.editorInterface).to.equal(editorInterfaceMock)
  })

  describe('.onLocaleSettingsChanged(handler)', () => {
    describeAttachHandlerMember('default behaviour', () => {
      return editor.onLocaleSettingsChanged(() => {})
    })
  })

  describe('.onShowDisabledFieldsChanged(handler)', () => {
    describeAttachHandlerMember('default behaviour', () => {
      return editor.onShowDisabledFieldsChanged(() => {})
    })
  })
})
