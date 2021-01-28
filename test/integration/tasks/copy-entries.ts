import { getCurrentSpace } from '../contentful-client'

export async function copyEntries(entryIds: Record<string, string>) {
  const space = await getCurrentSpace()
  const sourceEnvironment = await space.getEnvironment('master-base')
  const targetEnvironment = await space.getEnvironment('master-test')

  const newEntryIds: Record<string, string> = {}
  for (const [entryLabel, entryId] of Object.entries(entryIds)) {
    const entry = await sourceEnvironment.getEntry(entryId)
    const newEntry = await targetEnvironment.createEntry(entry.sys.contentType.sys.id, entry)
    newEntryIds[entryLabel] = newEntry.sys.id
  }
  return newEntryIds
}
