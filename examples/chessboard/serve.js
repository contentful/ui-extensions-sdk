var express = require('express')

express()
.use(express.static('./dist'))
.listen(3000)
