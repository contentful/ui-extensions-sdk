const spawn = require('cross-spawn')
const {
  isCanary,
  getVersion,
  restorePackageJson,
  setPackageName,
  PACKAGE_NAME,
  MODULE_MAIN_PATH,
  getTag,
} = require('./shared')

if (!process.env.NPM_TOKEN) {
  throw new Error('Missing NPM_TOKEN!')
}

try {
  console.log('')
  console.log(`📦 Deploying package: ${PACKAGE_NAME} (dry run)`)

  const version = getVersion()
  const tag = getTag(isCanary(version))

  console.log(` > 📝 Updating package name...`)
  setPackageName(PACKAGE_NAME)

  console.log(` > 📚 Publishing ${PACKAGE_NAME} on the registry... (dry run)`)
  const { status } = spawn.sync(
    'npm',
    ['publish', '--access', 'public', '--dry-run', '--tag', tag],
    {
      stdio: 'inherit',
      cwd: MODULE_MAIN_PATH,
    }
  )

  if (status !== 0) {
    throw new Error(`Failed to publish ${PACKAGE_NAME}`)
  }

  console.log(`✅ Dry run for ${PACKAGE_NAME} on ${tag} successful!`)
  console.log('')
} catch (err) {
  throw new Error(err)
} finally {
  restorePackageJson()
}
