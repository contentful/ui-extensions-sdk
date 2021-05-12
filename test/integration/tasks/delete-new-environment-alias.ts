import { getCurrentSpace } from '../contentful-client'
import { printStepTitle } from '../utils'

export default async (aliasId: string) => {
  printStepTitle('Remove previously created environment alias')

  const space = await getCurrentSpace()

  const alias = await space.getEnvironmentAlias(aliasId)

  await alias.delete()

  console.log(`"${aliasId}" alias is deleted`)

  return true
}
