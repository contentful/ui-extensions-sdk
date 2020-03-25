require('dotenv').config()

const buildExtensions = require('./tasks/build-extensions')
const deployExtensions = require('./tasks/deploy-extensions')
const deleteStaleEnvironments = require('./tasks/delete-stale-environments')
const createConfigurationFiles = require('./tasks/create-configuration-files')

const config = {
  managementToken: process.env.CONTENTFUL_CMA_TOKEN,
  spaceId: process.env.CONTENTFUL_SPACE_ID,
  baseUrl: process.env.CONTENTFUL_APP,
  environmentId: process.env.CONTENTFUL_LOCAL_TESTING_ENV,
  testLocalSdk: process.env.TEST_LOCAL_SDK === 'true'
}

function listAllEnvironmentVariables() {
  ;[
    'CONTENTFUL_SPACE_ID',
    'CYPRESS_baseUrl',
    'TEST_LOCAL_SDK',
    'CONTENTFUL_LOCAL_TESTING_ENV'
  ].forEach(envvar => {
    console.log(`${envvar}=${process.env[envvar]}`)
  })
  ;['CONTENTFUL_CMA_TOKEN'].forEach(envvar => {
    console.log(`${envvar}=${process.env[envvar].slice(0, 5)}...`)
  })
}

const run = async () => {
  console.log('TEST STALE ENVS')
  await deleteStaleEnvironments()

  if (config.environmentId === 'master') {
    throw new Error('Do not run tests on `master` enviroment.')
  }

  listAllEnvironmentVariables()

  await createConfigurationFiles({
    managementToken: config.managementToken,
    spaceId: config.spaceId,
    environmentId: config.environmentId
  })

  await buildExtensions({
    testLocalSdk: config.testLocalSdk
  })

  await deployExtensions()
}

/**
 * When running tests locally we don't create a new environment programmatically
 */
;(async function main() {
  try {
    await run()
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
