const getCurrentSpace = require('../contentful-client').getCurrentSpace
const printStepTitle = require('../utils').printStepTitle

module.exports = async environmentId => {
  printStepTitle('Remove previously created environment')

  const space = await getCurrentSpace()

  const environment = await space.getEnvironment(environmentId)

  await environment.delete()

  console.log(`"${environmentId}" environment is deleted`)

  return true
}
