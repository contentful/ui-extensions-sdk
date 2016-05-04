import { init } from '../../lib/api'

const AlloyEditor = window.AlloyEditor

init((widget) => {
  let currentValue

  widget.window.startAutoResizer()

  const editor = AlloyEditor.editable('content')._editor
  editor.setData(widget.field.getValue())

  widget.field.onValueChanged((value) => {
    if (value !== currentValue) {
      currentValue = value
      editor.setData(value)
    }
  })

  editor.on('change', () => {
    const value = editor.getData()

    if (currentValue !== value) {
      currentValue = value
      widget.field.setValue(value)
    }
  })
})
