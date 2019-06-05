require('dotenv').config()

const buildExtensions = require('./tasks/build-extensions')
const deployExtensions = require('./tasks/deploy-extensions')
const createEnvironment = require('./tasks/create-new-enviromenment')
const deleteEnvironment = require('./tasks/delete-new-environment')
const createConfigurationFiles = require('./tasks/create-configuration-files')
const runCypress = require('./tasks/run-cypress')

const config = {
  cmaToken: process.env.CONTENTFUL_CMA_TOKEN,
  spaceId: process.env.CONTENTFUL_SPACE,
  environmentId: process.env.CONTENTFUL_ENVIRONMENT,
  baseUrl: process.env.CONTENTFUL_APP,
  testLocalSdk: process.env.TEST_LOCAL_SDK === 'true'
}

let needCleanup = false

const cleanup = async () => {
  try {
    await deleteEnvironment(config.environmentId)
  } catch (e) {
    console.log(e)
    throw new Error('Failed to remove environment')
  }
}

const run = async () => {
  await createConfigurationFiles(config)

  try {
    await createEnvironment(config.environmentId)
    needCleanup = true
  } catch (e) {
    console.log(e)
    throw new Error('Failed to create a new environment')
  }

  await buildExtensions({
    testLocalSdk: config.testLocalSdk
  })

  await deployExtensions()

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
