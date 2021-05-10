const spawn = require('cross-spawn')
const {
  assertVersion,
  getVersion,
  restorePackageJson,
  setPackageName,
  PACKAGES,
  MODULE_MAIN_PATH,
  getTag,
} = require('./shared')

if (!process.env.NPM_TOKEN) {
  throw new Error('Missing NPM_TOKEN!')
}

try {
  for (const package of PACKAGES) {
    console.log('')
    console.log(`📦 Deploying package: ${package} (dry run)`)

    assertVersion(getVersion())
    const tag = getTag()

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
