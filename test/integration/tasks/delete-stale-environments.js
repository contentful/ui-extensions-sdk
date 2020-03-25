const getCurrentSpace = require('../contentful-client').getCurrentSpace
const printStepTitle = require('../utils').printStepTitle

const ONE_DAY = 60 * 60 * 24 * 1000

module.exports = async (currentSpace = getCurrentSpace) => {
  printStepTitle('Removing stale environments')

  const space = await currentSpace()
  const environments = await space.getEnvironments()
  const { items } = environments

  // filter for relevant environments
  const regexps = [/^master$/g, /test/g]
  const isProtected = name => regexps.some(rgx => new RegExp(rgx).test(name))

  const isStaleEnvironment = timeStamp => {
    const environmentDate = new Date(timeStamp).getTime()
    const difference = new Date().getTime() - environmentDate
    return difference >= ONE_DAY
  }
  const deletedEnvironmentIds = []

  items.forEach(async environment => {
    const {
      name,
      sys: { createdAt, id }
    } = environment
    if (!isProtected(name) && isStaleEnvironment(createdAt)) {
      try {
        console.log(environment)
        await environment.delete()
        deletedEnvironmentIds.push(id)
      } catch (error) {
        console.error(`Could not delete environment ${environment.sys.id}`)
      }
    }
  })

  return deletedEnvironmentIds
}
