import { describeAttachHandlerMember, sinon, expect } from '../helpers'

import createEditor from '../../lib/editor'
import { Channel } from '../../lib/channel'
import { EditorInterface } from '../../lib/types'

describe('createEditor()', () => {
  const channelStub = ({
    addHandler: sinon.spy()
  } as unknown) as Channel

  const editorInterfaceMock = ({
    sidebar: [],
    controls: []
  } as unknown) as EditorInterface

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
