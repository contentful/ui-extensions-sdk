const nanoid = require('nanoid')
const getCurrentSpace = require('../contentful-client').getCurrentSpace
const printStepTitle = require('../utils').printStepTitle

const delay = num => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, num)
  })
}

module.exports = async () => {
  printStepTitle('Creating a new environment for testing')

  const space = await getCurrentSpace()

  const environmentId = nanoid()

  let environment = await space.createEnvironmentWithId(
    environmentId,
    { name: environmentId },
    'master'
  )

  let status = environment.sys.status.sys.id

  while (status !== 'ready') {
    await delay(1500)
    environment = await space.getEnvironment(environmentId)
    status = environment.sys.status.sys.id
  }

  console.log(`New "${environmentId}" environment is created`)

  return environmentId
}
