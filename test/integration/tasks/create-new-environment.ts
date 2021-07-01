import { nanoid } from 'nanoid'
import { plainClient } from '../contentful-client'
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

  const environmentId = nanoid()

  let environment = (await plainClient.environment.createWithId(
    {
      environmentId,
      sourceEnvironmentId: 'test-base',
    },
    { name: environmentId }
  )) as any

  let status = environment.sys.status.sys.id

  while (status !== 'ready') {
    await delay(1500)
    environment = await plainClient.environment.get({ environmentId })
    status = environment.sys.status.sys.id
  }

  console.log(`New "${environmentId}" environment is created`)

  console.log(`Check if test alias "${testAliasId}" is available`)

  try {
    await plainClient.environmentAlias.get({ environmentAliasId: testAliasId })
  } catch (e) {
    if (JSON.parse(e.message).status === 404) {
      console.log(`"${testAliasId}" is not available, lets try to create it`)
      try {
        await plainClient.environmentAlias.createWithId(
          { environmentAliasId: testAliasId },
          {
            environment: {
              sys: { type: 'Link', linkType: 'Environment', id: 'test-base' },
            },
          }
        )
        console.log(`New alias "${testAliasId}" has been created`)
      } catch (e) {
        console.error('Could not create the alias', e)
        throw e
      }
    } else {
      throw e
    }
  }

  return environmentId
}
