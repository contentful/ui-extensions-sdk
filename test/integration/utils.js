const fs = require('fs-extra')
const os = require('os')

let stepCount = 1

function printStepTitle(title) {
  console.log('')
  console.log('-----------------------')
  console.log(`Step ${stepCount++}: ${title}`)
  console.log('-----------------------')
  console.log('')
}

function writeJSONFile(path, obj) {
  fs.writeFileSync(path, JSON.stringify(obj, null, 2) + os.EOL, {
    encoding: 'utf8',
    flag: 'w'
  })
}

module.exports = {
  printStepTitle,
  writeJSONFile
}
