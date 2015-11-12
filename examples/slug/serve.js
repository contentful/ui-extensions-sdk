var express = require('express')

express()
.use(express.static('.'))
.listen(3000, function () {
  console.log('listening on http://localhost:3000')
})
