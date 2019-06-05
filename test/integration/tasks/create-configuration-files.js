const writeJSONFile = require('../utils').writeJSONFile
const resolvePath = require('../utils').resolvePath
const printStepTitle = require('../utils').printStepTitle

module.exports = async ({ cmaToken, spaceId, environmentId }) => {
  printStepTitle('Creating configuration files based on environment variables')

  await writeJSONFile(resolvePath('test-extensions/test-field-extension/.contentfulrc.json'), {
    cmaToken: cmaToken,
    activeSpaceId: spaceId,
    activeEnvironmentId: environmentId
  })
  await writeJSONFile(resolvePath('cypress.env.json'), {
    cmaToken: cmaToken,
    activeSpaceId: spaceId,
    activeEnvironmentId: environmentId
  })

  console.log('Created test-extensions/test-field-extension/.contentfulrc.json')
  console.log('Created cypress.env.json')
}
