import { getCurrentSpace } from '../contentful-client'
import { printStepTitle, sleep } from '../utils'
import { isProtected, isStale } from './stale-utils'

export default async (currentSpace = getCurrentSpace) => {
  printStepTitle('Removing stale environments')

  const space = await currentSpace()
  const environments = await space.getEnvironments()
  const { items } = environments
  const deletedEnvironmentIds: string[] = []
  items.forEach(async (environment: any) => {
    const {
      name,
      sys: { createdAt, id },
    } = environment
    if (!isProtected(name) && isStale(createdAt)) {
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
