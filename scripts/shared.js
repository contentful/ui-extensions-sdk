const path = require('path')
const spawn = require('cross-spawn')
const fs = require('fs')

const PACKAGES = ['contentful-ui-extensions-sdk', '@contentful/app-sdk']
const MODULE_MAIN_PATH = path.resolve(__dirname, '..')
const PACKAGE_JSON_PATH = path.resolve(MODULE_MAIN_PATH, 'package.json')

const ORIGINAL_PACKAGE_JSON = require(PACKAGE_JSON_PATH)
const CANARY_REGEXP = /\d+\.\d+\.\d+-alpha\.\d+/

function isCanary(version) {
  return CANARY_REGEXP.test(version)
}

function getVersion() {
  return require(PACKAGE_JSON_PATH).version
}

// Mirrors @semantic-release/npm: npm rejects dist-tags that are valid semver ranges, so a "4.x" channel publishes as "release-4.x"
const MAINTENANCE_CHANNEL_REGEXP = /^\d+(\.(\d+|x))?\.x$/

function getTag(isCanary, channel = process.env.RELEASE_CHANNEL) {
  if (channel) {
    return MAINTENANCE_CHANNEL_REGEXP.test(channel) ? `release-${channel}` : channel
  }
  return isCanary ? 'canary' : 'latest'
}

function restorePackageJson() {
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(ORIGINAL_PACKAGE_JSON, null, 2))
  spawn.sync('npm', ['install'], { silent: true, cwd: MODULE_MAIN_PATH })
}

function setPackageName(name) {
  const packageJson = { ...ORIGINAL_PACKAGE_JSON, name }
  fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson))
  spawn.sync('npm', ['install'], { silent: true, cwd: MODULE_MAIN_PATH })
}

module.exports = {
  PACKAGES,
  MODULE_MAIN_PATH,
  PACKAGE_JSON_PATH,
  getVersion,
  restorePackageJson,
  setPackageName,
  getTag,
  isCanary,
}
