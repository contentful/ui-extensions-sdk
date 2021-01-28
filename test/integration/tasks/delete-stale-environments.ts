import { getCurrentSpace } from '../contentful-client'
import { printStepTitle, sleep } from '../utils'

const ONE_DAY_IN_MS = 60 * 60 * 24 * 1000

export default async (currentSpace = getCurrentSpace) => {
  printStepTitle('Removing stale environments')

  const space = await currentSpace()
  const environments = await space.getEnvironments()
  const { items } = environments

  // filter for relevant environments
  const isProtected = (name: string) =>
    name === 'master' || name.includes('test') || name === 'master-base'

  const isStaleEnvironment = (timeStamp: string) => {
    const environmentDate = new Date(timeStamp).getTime()
    const difference = Date.now() - environmentDate
    return difference >= ONE_DAY_IN_MS
  }
  const deletedEnvironmentIds: string[] = []
  items.forEach(async (environment: any) => {
    const {
      name,
      sys: { createdAt, id },
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
