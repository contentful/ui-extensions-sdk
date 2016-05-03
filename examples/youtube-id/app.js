/* global $ */
import { init } from '../../lib/api'

init((widget) => {
  const $code = $('code')

  widget.field.onValueChanged(function (value) {
    $code.text(value || '')
  })

  $('button').on('click', function () {
    $code.text('')
    widget.field.setValue(null)
  })

  $('input').on('input', function (ev) {
    const match = ev.target.value.match(/youtube\.com\/watch\?v=(\w+)/)

    if (match) {
      widget.field.setValue(match[1])
      $code.text(match[1])
    }
  })
})
