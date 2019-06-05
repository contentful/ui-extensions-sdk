const nanoid = require('nanoid')
const getCurrentSpace = require('../contentful-client').getCurrentSpace
const printStepTitle = require('../utils').printStepTitle

module.exports = async () => {
  printStepTitle('Creating a new environment for testing')

  const space = await getCurrentSpace()

  const environmentId = nanoid()

  await space.createEnvironmentWithId(environmentId, { name: environmentId }, 'master')

  console.log(`New "${environmentId}" environment is created`)

  return environmentId
}
