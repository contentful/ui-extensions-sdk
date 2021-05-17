import { getCurrentSpace } from '../contentful-client'
import { printStepTitle, sleep } from '../utils'
import { isProtected, isStale } from './stale-utils'

export default async (currentSpace = getCurrentSpace) => {
  printStepTitle('Removing stale aliases')

  const space = await currentSpace()
  const aliases = await space.getEnvironmentAliases()
  const { items } = aliases

  const deletedAliasIds: string[] = []
  items.forEach(async (alias: any) => {
    const {
      sys: { createdAt, id },
    } = alias
    if (!isProtected(id) && isStale(createdAt)) {
      try {
        await alias.delete()
        deletedAliasIds.push(id)
        await sleep(200)
      } catch (error) {
        console.error(`Could not delete alias ${alias.sys.id}`)
      }
    }
  })

  return deletedAliasIds
}
