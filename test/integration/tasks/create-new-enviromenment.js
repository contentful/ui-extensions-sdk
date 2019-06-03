const getCurrentSpace = require('../contentful-client').getCurrentSpace

module.exports = async environmentId => {
  const space = await getCurrentSpace()

  const environment = await space.createEnvironmentWithId(
    environmentId,
    { name: 'Testing' },
    'master'
  )

  console.log(`New "${environmentId}" environment is created`)

  return environment
}
