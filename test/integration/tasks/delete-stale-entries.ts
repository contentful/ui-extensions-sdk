import { plainClient } from '../contentful-client'
import { printStepTitle, sleep } from '../utils'

const TWO_HOURS_IN_MS = 60 * 60 * 2 * 1000

export default async (client = plainClient) => {
  printStepTitle('Removing stale entries from master-test')

  const entryCollection = await client.entry.getMany({ environmentId: 'master-test' })
  const { items: entries } = entryCollection

  const isStaleEntry = (timeStamp: string) => {
    const entryDate = new Date(timeStamp).getTime()
    const difference = Date.now() - entryDate
    return difference >= TWO_HOURS_IN_MS
  }

  const deletedEntries: string[] = []
  for (const entry of entries) {
    const {
      sys: { createdAt, id },
    } = entry
    if (!isStaleEntry(createdAt)) {
      continue
    }

    try {
      await client.entry.delete({ entryId: id })
      console.log(`Deleted entry ${id}`)
      deletedEntries.push(id)
      await sleep(200)
    } catch (error) {
      console.error(`Could not delete entry ${id}`)
    }
  }

  return deletedEntries
}
