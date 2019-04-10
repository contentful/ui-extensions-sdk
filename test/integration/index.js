const fs = require('fs')
const path = require('path');

[
  'CONTENTFUL_PAT',
  'CONTENTFUL_CMA_URL',
  'CONTENTFUL_APP_URL',
  'CONTENTFUL_USER',
  'CONTENTFUL_PASSWORD'
].forEach(envvar => {
  console.log(`${envvar}=${process.env[envvar]}`)
})

const sdkFile = path.resolve(__dirname, '../../dist/cf-extension-api.js')
const sdk = fs.readFileSync(sdkFile, 'utf8')

console.log(`\n\nSDK:\n${sdk.slice(0, 500)}...\n\n`)

console.log('No tests yet.')

process.exit(0)
