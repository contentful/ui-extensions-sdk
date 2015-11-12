var cfWidget = window.contentfulWidget
var ChessBoard = window.ChessBoard
var $ = window.$

cfWidget.init(function (api) {
  api.window.updateHeight(440)

  api.entry.onSysChanged((sys) => {
    // console.log('sys', sys)
  })

  var board = ChessBoard('board', {
    draggable: true,
    dropOffBoard: 'trash',
    onChange: function (old, current) {
      api.field.setValue(current)
    }
  })

  board.position(api.field.getValue())

  api.field.onValueChanged(function (p) {
    board.position(p)
  })


  $('button').on('click', function () {
    board.start()
  })
})
