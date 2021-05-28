import { nanoid } from 'nanoid'
import { getCurrentSpace } from '../contentful-client'
import { printStepTitle, testAliasId } from '../utils'

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

  console.log(`Check if test alias "${testAliasId}" is available`)

  try {
    await space.getEnvironmentAlias(testAliasId)
  } catch (e) {
    if (JSON.parse(e.message).status === 404) {
      console.log(`"${testAliasId}" is not available, lets try to create it`)
      try {
        const baseEnvironment = await space.getEnvironment('test-base')
        await space.createEnvironmentAliasWithId(testAliasId, {
          environment: baseEnvironment as any,
        })
        console.log(`New alias "${testAliasId}" has been created`)
      } catch (e) {
        console.log('Could not create the alias', e)
      }
    } else {
      throw e
    }
  }

  return environmentId
}
