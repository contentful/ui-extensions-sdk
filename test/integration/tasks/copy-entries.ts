import { plainClient } from '../contentful-client'
import { printStepTitle } from '../utils'

export default async function copyEntries(entryIds: Record<string, string>) {
  printStepTitle('Copying entries from test-base to master-test')

  const environmentId = 'test-base'

  const newEntryIds: Record<string, string> = {}
  for (const [entryLabel, entryId] of Object.entries(entryIds)) {
    const entry = await plainClient.entry.get({ entryId, environmentId })
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { sys, ...rest } = entry
    const newEntry = await plainClient.entry.create(
      { contentTypeId: entry.sys.contentType.sys.id, environmentId },
      rest
    )
    newEntryIds[entryLabel] = newEntry.sys.id
  }
  return newEntryIds
}
