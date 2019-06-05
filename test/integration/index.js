require('dotenv').config()

const buildAndPublishExtensions = require('./tasks/build-and-publish-extensions')
const createEnvironment = require('./tasks/create-new-enviromenment')
const deleteEnvironment = require('./tasks/delete-new-environment')
const createConfigurationFiles = require('./tasks/create-configuration-files')
const runCypress = require('./tasks/run-cypress')
const buildAndLinkSdk = require('./tasks/build-and-link-sdk')
const printStepTitle = require('./utils').printStepTitle

const config = {
  cmaToken: process.env.CONTENTFUL_CMA_TOKEN,
  spaceId: process.env.CONTENTFUL_SPACE,
  environmentId: process.env.CONTENTFUL_ENVIRONMENT,
  baseUrl: process.env.CONTENTFUL_APP,
  testLocalSdk: process.env.TEST_LOCAL_SDK
}

let needCleanup = false

function listAllEnvironmentVariables() {
  ;[
    'CONTENTFUL_SPACE',
    'CONTENTFUL_CMA_TOKEN',
    'CONTENTFUL_ENVIRONMENT',
    'CYPRESS_BASE_URL',
    'TEST_LOCAL_SDK'
  ].forEach(envvar => {
    console.log(`${envvar}=${process.env[envvar]}`)
  })
}

const cleanup = async () => {
  printStepTitle('Remove previously created environment')

  try {
    await deleteEnvironment(config.environmentId)
  } catch (e) {
    console.log(e)
    throw new Error('Failed to remove environment')
  }
}

const run = async () => {
  printStepTitle('Creating configuration files based on environment variables')
  listAllEnvironmentVariables()
  await createConfigurationFiles(config)

  printStepTitle('Creating a new environment for testing')

  try {
    await createEnvironment(config.environmentId)
    needCleanup = true
  } catch (e) {
    console.log(e)
    throw new Error('Failed to create a new environment')
  }

  if (config.testLocalSdk) {
    printStepTitle('Building local copy of ui-extensions-sdk')
    await buildAndLinkSdk()
  }

  printStepTitle('Build extensions and deploy it')
  await buildAndPublishExtensions({
    testLocalSdk: config.testLocalSdk
  })

  printStepTitle('Runnings tests...')
  try {
    await runCypress({
      baseUrl: config.baseUrl
    })
  } catch (e) {}
}

run()
  .then(async () => {
    if (needCleanup) {
      await cleanup()
    }
    process.exit(0)
  })
  .catch(async e => {
    if (needCleanup) {
      await cleanup()
    }
    console.error(e)
    process.exit(1)
  })
