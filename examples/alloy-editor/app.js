import { init } from '../../lib/api'

const AlloyEditor = window.AlloyEditor

init((api) => {
  let currentValue

  api.window.updateHeight(200)
  api.window.startAutoResizer()

  const editor = AlloyEditor.editable('content')._editor
  editor.setData(api.field.getValue())

  api.field.onValueChanged((value) => {
    if (value !== currentValue) {
      currentValue = value
      editor.setData(value)
    }
  })

  editor.on('change', () => {
    const value = editor.getData()

    if (currentValue !== value) {
      currentValue = value
      api.field.setValue(value)
    }
  })
})
