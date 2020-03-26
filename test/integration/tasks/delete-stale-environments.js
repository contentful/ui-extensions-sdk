const getCurrentSpace = require('../contentful-client').getCurrentSpace
const { printStepTitle, sleep } = require('../utils')

const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000

module.exports = async (currentSpace = getCurrentSpace) => {
  printStepTitle('Removing stale environments')

  const space = await currentSpace()
  const environments = await space.getEnvironments()
  const { items } = environments

  // filter for relevant environments
  const isProtected = name => name === 'master' || name.includes('test')

  const isStaleEnvironment = timeStamp => {
    const environmentDate = new Date(timeStamp).getTime()
    const difference = Date.now() - environmentDate
    return difference >= ONE_DAY_IN_MS
  }
  const deletedEnvironmentIds = []
  items.forEach(async environment => {
    const {
      name,
      sys: { createdAt, id }
    } = environment
    if (!isProtected(name) && isStaleEnvironment(createdAt)) {
      try {
        await environment.delete()
        deletedEnvironmentIds.push(id)
        await sleep(200)
      } catch (error) {
        console.error(`Could not delete environment ${environment.sys.id}`)
      }
    }
  })

  return deletedEnvironmentIds
}
