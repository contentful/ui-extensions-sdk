const { describeAttachHandlerMember, sinon, expect } = require('../helpers')

const createEditor = require('../../lib/editor')

describe('createEditor()', () => {
  const channelStub = {
    addHandler: sinon.spy()
  }

  const editorInterfaceMock = {
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
