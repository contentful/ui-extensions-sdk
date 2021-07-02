import { plainClient } from '../contentful-client'
import { printStepTitle } from '../utils'

export default async function deleteEntries(entries: { environmentId: string; entryId: string }[]) {
  printStepTitle('Deleting temporary entries')

  for (const { environmentId, entryId } of entries) {
    console.log('Deleting', { environmentId, entryId })

    await plainClient.entry.delete({ entryId, environmentId })
  }
}
