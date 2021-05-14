import { nanoid } from 'nanoid'
import { getCurrentSpace } from '../contentful-client'
import { printStepTitle } from '../utils'

const delay = (num: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, num)
  })
}

export default async () => {
  printStepTitle('Creating a new environment for testing')

  const space = await getCurrentSpace()

  const environmentId = nanoid()

  let environment = (await space.createEnvironmentWithId(
    environmentId,
    { name: environmentId },
    'test-base'
  )) as any

  let status = environment.sys.status.sys.id

  while (status !== 'ready') {
    await delay(1500)
    environment = await space.getEnvironment(environmentId)
    status = environment.sys.status.sys.id
  }

  console.log(`New "${environmentId}" environment is created`)

  const aliasId = nanoid()
  const alias = (await space.createEnvironmentAliasWithId(aliasId, { environment })) as any

  console.log(`New "${aliasId}" alias is created`)

  return { environmentId, aliasId: alias.sys.id }
}
