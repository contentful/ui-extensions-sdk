import { plainClient } from '../contentful-client'
import { printStepTitle } from '../utils'

export default async function copyEntries(entryIds: Record<string, string>) {
  printStepTitle('Copying entries from test-base to master-test')

  const newEntryIds: Record<string, string> = {}
  for (const [entryLabel, entryId] of Object.entries(entryIds)) {
    const entry = await plainClient.entry.get({ entryId, environmentId: 'test-base' })
    const newEntry = await plainClient.entry.createWithId(
      { entryId, contentTypeId: entry.sys.contentType.sys.id },
      entry
    )
    newEntryIds[entryLabel] = newEntry.sys.id
  }
  return newEntryIds
}
