const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')

const PACKAGES = [
  'contentful-ui-extensions-sdk',
  '@contentful/ui-extensions-sdk',
  '@contentful/app-sdk',
]
const MODULE_MAIN_PATH = path.resolve(__dirname, '..')
const PACKAGE_JSON_PATH = path.resolve(MODULE_MAIN_PATH, 'package.json')

const ORIGINAL_PACKAGE_JSON = require(PACKAGE_JSON_PATH)

function restoreFiles() {
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(ORIGINAL_PACKAGE_JSON, null, 2))
  spawn.sync('npm', ['install'], { silent: true, cwd: MODULE_MAIN_PATH })
}

if (!process.env.NPM_TOKEN) {
  throw new Error('Missing NPM_TOKEN!')
}

try {
  for (const package of PACKAGES) {
    console.log('')
    console.log('📦 Deploying package:', package)
    const packageJson = { ...ORIGINAL_PACKAGE_JSON, name: package }

    console.log(` > 📝 Updating package.json with name: ${package}...`)
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson))

    console.log(` > ⚙️  Updating package-lock.json by means of "npm install"...`)
    spawn.sync('npm', ['install'], { silent: true, cwd: MODULE_MAIN_PATH })

    console.log(` > 📚 Publishing ${package} on the registry...`)
    const { status } = spawn.sync('npm', ['publish', '--access', 'public'], {
      stdio: 'inherit',
      cwd: MODULE_MAIN_PATH,
    })
    if (status !== 0) {
      throw new Error(
        'Failed to publish. Please check the output above and make sure you have the correct credentials, working network and npm is not down.'
      )
    }

    console.log(`✅ Successfully published ${package}@${ORIGINAL_PACKAGE_JSON.version}!`)
    console.log('')
  }
} catch (err) {
  throw new Error(err)
} finally {
  restoreFiles()
}
