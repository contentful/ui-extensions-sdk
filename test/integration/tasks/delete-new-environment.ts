import { plainClient } from '../contentful-client'
import { printStepTitle } from '../utils'

export default async (environmentId: string) => {
  printStepTitle('Remove previously created environment')

  await plainClient.environment.delete({ environmentId })

  console.log(`"${environmentId}" environment is deleted`)

  return true
}
