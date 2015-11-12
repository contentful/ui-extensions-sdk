require('../../lib')

window.addEventListener('cfWidgetReady', function (ev) {
  setup(ev.detail)
});

function setup (api) {
  window.api = api
  api.field.addObserver(function (value) {
    $('code').text(value || '');
  })
  $('button').on('click', function () {
    $('code').text('');
    api.field.setValue(null)
  })
  $('input').on('input', function (ev) {
    var value = ev.target.value
    var match = value.match(/youtube\.com\/watch\?v=(\w+)/)
    if (match) {
      api.field.setValue(match[1])
      $('code').text(match[1])
    }
  })
}
