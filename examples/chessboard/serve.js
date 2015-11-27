var express = require('express')

express()
.use(express.static('.'))
.use(express.static('./dist'))
.listen(3000)
