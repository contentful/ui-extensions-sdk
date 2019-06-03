const writeJSONFile = require('../utils').writeJSONFile
const resolvePath = require('../utils').resolvePath

module.exports = async config => {
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
