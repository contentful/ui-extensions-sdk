require('dotenv').config()

const buildExtensions = require('./tasks/build-extensions')
const deployExtensions = require('./tasks/deploy-extensions')
const createConfigurationFiles = require('./tasks/create-configuration-files')

const config = {
  cmaToken: process.env.CONTENTFUL_CMA_TOKEN,
  spaceId: process.env.CONTENTFUL_SPACE,
  baseUrl: process.env.CONTENTFUL_APP,
  environmentId: process.env.CONTENTFUL_LOCAL_TESTING_ENV,
  testLocalSdk: process.env.TEST_LOCAL_SDK === 'true'
}

function listAllEnvironmentVariables() {
  ;[
    'CONTENTFUL_SPACE',
    'CONTENTFUL_CMA_TOKEN',
    'CYPRESS_BASE_URL',
    'TEST_LOCAL_SDK',
    'CONTENTFUL_LOCAL_TESTING_ENV'
  ].forEach(envvar => {
    console.log(`${envvar}=${process.env[envvar]}`)
  })
}

const run = async () => {
  listAllEnvironmentVariables()

  await createConfigurationFiles({
    cmaToken: config.cmaToken,
    spaceId: config.spaceId,
    environmentId: config.environmentId
  })

  await buildExtensions({
    testLocalSdk: config.testLocalSdk
  })

  await deployExtensions()
}

;(async function main() {
  try {
    await run()
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
