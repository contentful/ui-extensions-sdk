const spawn = require('cross-spawn')
const {
  isCanary,
  getVersion,
  restorePackageJson,
  setPackageName,
  PACKAGES,
  MODULE_MAIN_PATH,
  getTag,
} = require('./shared')

try {
  for (const package of PACKAGES) {
    console.log('')
    console.log(`📦 Deploying package: ${package} (dry run)`)

    const version = getVersion()
    const tag = getTag(isCanary(version))

    console.log(` > 📝 Updating package name...`)
    setPackageName(package)

    console.log(` > 📚 Publishing ${package} on the registry... (dry run)`)
    const { status } = spawn.sync(
      'npm',
      ['publish', '--access', 'public', '--dry-run', '--tag', tag],
      {
        stdio: 'inherit',
        cwd: MODULE_MAIN_PATH,
      }
    )

    if (status !== 0) {
      throw new Error(`Failed to publish ${package}`)
    }

    console.log(`✅ Dry run for ${package} on ${tag} successful!`)
    console.log('')
  }
} catch (err) {
  throw new Error(err)
} finally {
  restorePackageJson()
}
