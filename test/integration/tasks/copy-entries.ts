import { getCurrentSpace } from '../contentful-client'
import { printStepTitle } from '../utils'

export default async function copyEntries(entryIds: Record<string, string>) {
  printStepTitle('Copying entries from test-base to master-test')

  const space = await getCurrentSpace()
  const sourceEnvironment = await space.getEnvironment('test-base')
  const targetEnvironment = await space.getEnvironment('master-test')

  const newEntryIds: Record<string, string> = {}
  for (const [entryLabel, entryId] of Object.entries(entryIds)) {
    const entry = await sourceEnvironment.getEntry(entryId)
    const newEntry = await targetEnvironment.createEntry(entry.sys.contentType.sys.id, entry)
    newEntryIds[entryLabel] = newEntry.sys.id
  }
  return newEntryIds
}
