const getCurrentSpace = require('../contentful-client').getCurrentSpace
const printStepTitle = require('../utils').printStepTitle

module.exports = async environmentId => {
  printStepTitle('Creating a new environment for testing')

  const space = await getCurrentSpace()

  const environment = await space.createEnvironmentWithId(
    environmentId,
    { name: 'Testing' },
    'master'
  )

  console.log(`New "${environmentId}" environment is created`)

  return environment
}
