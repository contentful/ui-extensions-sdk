const writeJSONFile = require('../utils').writeJSONFile
const resolvePath = require('../utils').resolvePath
const printStepTitle = require('../utils').printStepTitle

module.exports = async ({ managementToken, spaceId, environmentId }) => {
  printStepTitle('Creating configuration files based on environment variables')

  async function writeJSONForExtension(extensionId) {
    await writeJSONFile(resolvePath(`test/extensions/${extensionId}/.contentfulrc.json`), {
      managementToken: managementToken,
      activeSpaceId: spaceId,
      activeEnvironmentId: environmentId,
      host: 'api.contentful.com'
    })

    console.log(`Created test/extensions/${extensionId}/.contentfulrc.json`)
    console.log('Created cypress.env.json')
  }

  await Promise.all(['test-extension'].map(writeJSONForExtension))

  await writeJSONFile(resolvePath('cypress.env.json'), {
    managementToken: managementToken,
    activeSpaceId: spaceId,
    activeEnvironmentId: environmentId
  })
}
