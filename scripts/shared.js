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

function getTag() {
  return process.env.CANARY ? 'canary' : 'latest'
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
