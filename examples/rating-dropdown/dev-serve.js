try {
  var express = require('express')
} catch (e) {
  console.error('ERROR Express it not installed. Please run `npm install express`')
  process.exit(1)
}

express()
.use(express.static('.'))
.listen(3000)
