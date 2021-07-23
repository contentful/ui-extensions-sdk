import { EntryProps, KeyValueMap } from 'contentful-management/types'
import { plainClient } from '../contentful-client'
import { printStepTitle } from '../utils'

const TWO_HOURS_IN_MS = 60 * 60 * 2 * 1000

export default async (client = plainClient) => {
  printStepTitle('Removing stale entries from master-test')

  const entryCollection = await client.entry.getMany({ environmentId: 'master-test' })
  const { items: entries } = entryCollection

  const isStaleEntry = (entry: EntryProps<KeyValueMap>) => {
    const entryDate = new Date(entry.sys.createdAt).getTime()
    const difference = Date.now() - entryDate
    return difference >= TWO_HOURS_IN_MS
  }

  const promiseResults = await Promise.allSettled(
    entries
      .filter((entry) => isStaleEntry(entry))
      .map(async (entry) => {
        const id = entry.sys.id

        try {
          if (entry.sys.publishedVersion) {
            await client.entry.unpublish({ entryId: id, environmentId: 'master-test' })
          }

          await client.entry.delete({ entryId: id, environmentId: 'master-test' })
          console.log(`Deleted entry ${id}`)
          return id
        } catch (error) {
          console.error(`Could not delete entry ${id}`)
        }
      })
  )

  return promiseResults
    .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled')
    .map((r) => r.value)
}
