import widget from '../../lib/api'

let AlloyEditor = window.AlloyEditor
widget.init((api) => {
  api.window.updateHeight(200)
  api.window.startAutoResizer()
  let editor = AlloyEditor.editable('content')._editor
  let currentValue
  editor.setData(api.field.getValue())

  api.field.onValueChanged((value) => {
    if (value !== currentValue) {
      currentValue = value
      editor.setData(value)
    }
  })

  editor.on('change', () => {
    var value = editor.getData()
    if (currentValue !== value) {
      currentValue = value
      api.field.setValue(value)
    }
  })
})
