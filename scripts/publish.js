const spawn = require('cross-spawn')
const {
  restorePackageJson,
  setPackageName,
  PACKAGES,
  MODULE_MAIN_PATH,
  getVersion,
} = require('./shared')

try {
  for (const package of PACKAGES) {
    console.log('')
    console.log(`📦 Deploying package: ${package}`)
    console.log(` > 📝 Updating package name...`)
    setPackageName(package)

    console.log(` > 📚 Publishing ${package} on the registry...`)
    const { status } = spawn.sync('npm', ['publish', '--access', 'public'], {
      stdio: 'inherit',
      cwd: MODULE_MAIN_PATH,
    })

    if (status !== 0) {
      throw new Error(`Failed to publish ${package}`)
    }

    console.log(`✅ Successfully published ${package}@${getVersion()}!`)
    console.log('')
  }
} catch (err) {
  throw new Error(err)
} finally {
  restorePackageJson()
}
