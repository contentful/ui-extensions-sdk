import { getCurrentSpace } from '../contentful-client'
import { printStepTitle } from '../utils'

export default async environmentId => {
  printStepTitle('Remove previously created environment')

  const space = await getCurrentSpace()

  const environment = await space.getEnvironment(environmentId)

  await environment.delete()

  console.log(`"${environmentId}" environment is deleted`)

  return true
}
