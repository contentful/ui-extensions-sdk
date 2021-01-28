import { getCurrentSpace } from '../contentful-client'
import { printStepTitle } from '../utils'

export default async function deleteEntries(entries: { environmentId: string; entryId: string }[]) {
  printStepTitle('Deleting temporary entries')

  const space = await getCurrentSpace()
  for (const { environmentId, entryId } of entries) {
    console.log('Deleting', { environmentId, entryId })

    const environment = await space.getEnvironment(environmentId)
    const entry = await environment.getEntry(entryId)
    await entry.delete()
  }
}
