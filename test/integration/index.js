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
  baseUrl: process.env.CONTENTFUL_APP,
  testLocalSdk: process.env.TEST_LOCAL_SDK === 'true'
}

function listAllEnvironmentVariables() {
  ;['CONTENTFUL_SPACE', 'CONTENTFUL_CMA_TOKEN', 'CYPRESS_BASE_URL', 'TEST_LOCAL_SDK'].forEach(
    envvar => {
      console.log(`${envvar}=${process.env[envvar]}`)
    }
  )
}

let environmentId

const cleanup = async () => {
  if (environmentId) {
    try {
      await deleteEnvironment(environmentId)
    } catch (e) {
      console.log(e)
      throw new Error('Failed to remove environment')
    }
  }
}

const run = async () => {
  listAllEnvironmentVariables()

  try {
    environmentId = await createEnvironment()
  } catch (e) {
    console.log(e)
    throw new Error('Failed to create a new environment')
  }

  await createConfigurationFiles({
    cmaToken: config.cmaToken,
    spaceId: config.spaceId,
    environmentId
  })

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
    await cleanup()

    process.exit(0)
  })
  .catch(async e => {
    await cleanup()
    console.error(e)
    process.exit(1)
  })
