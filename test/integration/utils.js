const fs = require('fs-extra')
const os = require('os')
const path = require('path')

const rootDirectory = fs.realpathSync(process.cwd())
const resolvePath = relativePath => path.resolve(rootDirectory, relativePath)

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

function sleep(duration) {
  return new Promise(resolve => setTimeout(resolve, duration))
}

module.exports = {
  printStepTitle,
  writeJSONFile,
  resolvePath,
  sleep
}
