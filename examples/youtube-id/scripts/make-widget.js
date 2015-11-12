#!/usr/bin/env node

var source = process.argv[2]
var fs = require('fs');
var srcdoc = fs.readFileSync(source, 'utf8')

console.log(JSON.stringify({
  fieldTypes: ['Symbol'],
  name: 'Youtube ID',
  srcdoc: srcdoc
}))
