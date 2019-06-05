const writeJSONFile = require('../utils').writeJSONFile
const resolvePath = require('../utils').resolvePath
const printStepTitle = require('../utils').printStepTitle

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

module.exports = async config => {
  printStepTitle('Creating configuration files based on environment variables')

  listAllEnvironmentVariables()

  await writeJSONFile(resolvePath('test-extensions/test-field-extension/.contentfulrc.json'), {
    cmaToken: config.cmaToken,
    activeSpaceId: config.spaceId,
    activeEnvironmentId: config.environmentId
  })
  await writeJSONFile(resolvePath('cypress.env.json'), {
    cmaToken: config.cmaToken,
    activeSpaceId: config.spaceId,
    activeEnvironmentId: config.environmentId
  })
}
