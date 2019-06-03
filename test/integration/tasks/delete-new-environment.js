const getCurrentSpace = require('../contentful-client').getCurrentSpace

module.exports = async environmentId => {
  const space = await getCurrentSpace()

  const environment = await space.getEnvironment(environmentId)

  await environment.delete()

  console.log(`"${environmentId}" environment is deleted`)

  return true
}
