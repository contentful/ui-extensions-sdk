const spawn = require('cross-spawn')
const fs = require('fs')
const {
  isCanary,
  getVersion,
  restorePackageJson,
  setPackageName,
  PACKAGES,
  MODULE_MAIN_PATH,
  PACKAGE_JSON_PATH,
  getTag,
} = require('./shared')

/**
 * Generate a unique version for dry-run verification.
 * 
 * This is needed because `npm publish --dry-run` will fail if the current
 * version already exists on npm. Since this script runs during semantic-release's
 * `verifyConditions` step (BEFORE the next version is determined), we need to
 * use a temporary version that definitely doesn't exist on npm.
 * 
 * Note: This function reads the current package.json (which should have the
 * package name already set by setPackageName()) and only modifies the version.
 */
function setDryRunVersion() {
  try {
    const packageJson = JSON.parse(fs.readFileSync(PACKAGE_JSON_PATH, 'utf8'))
    const timestamp = Date.now()
    // Use a version that will never conflict: 0.0.0-verify.{timestamp}
    // Preserve all other fields (including name set by setPackageName)
    packageJson.version = `0.0.0-verify.${timestamp}`
    // Add trailing newline to match file formatting conventions
    fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2) + '\n')
    return packageJson.version
  } catch (err) {
    console.error(`❌ Failed to set dry-run version in ${PACKAGE_JSON_PATH}:`, err.message)
    throw err
  }
}

try {
  for (const package of PACKAGES) {
    console.log('')
    console.log(`📦 Deploying package: ${package} (dry run)`)

    const originalVersion = getVersion()
    const tag = getTag(isCanary(originalVersion))

    console.log(` > 📝 Updating package name...`)
    setPackageName(package)

    // Set a temporary version for dry-run to avoid "version already exists" errors
    const dryRunVersion = setDryRunVersion()
    console.log(` > 🔄 Using temporary version ${dryRunVersion} for dry-run verification`)

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
