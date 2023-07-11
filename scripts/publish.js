const spawn = require('cross-spawn')
const {
  isCanary,
  restorePackageJson,
  setPackageName,
  PACKAGE_NAME,
  MODULE_MAIN_PATH,
  getVersion,
  getTag,
} = require('./shared')

try {
  console.log('')
  console.log(`📦 Deploying package: ${PACKAGE_NAME}`)

  const version = getVersion()
  const tag = getTag(isCanary(version))

  console.log(` > 📝 Updating package name...`)
  setPackageName(PACKAGE_NAME)

  console.log(` > 📚 Publishing ${PACKAGE_NAME} on the registry...`)
  const { status } = spawn.sync('npm', ['publish', '--access', 'public', '--tag', tag], {
    stdio: 'inherit',
    cwd: MODULE_MAIN_PATH,
  })

  if (status !== 0) {
    throw new Error(`Failed to publish ${PACKAGE_NAME}`)
  }

  console.log(`✅ Successfully published ${PACKAGE_NAME}@${getVersion()} on ${tag}!`)
  console.log('')
} catch (err) {
  throw new Error(err)
} finally {
  restorePackageJson()
}
