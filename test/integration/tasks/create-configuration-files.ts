import { writeJSONFile, resolvePath, printStepTitle } from '../utils'

export default async ({
  managementToken,
  spaceId,
  environmentId,
}: {
  managementToken: string
  spaceId: string
  environmentId: string
}) => {
  printStepTitle('Creating configuration files based on environment variables')

  async function writeJSONForExtension(extensionId: string) {
    writeJSONFile(resolvePath(`test/extensions/${extensionId}/.contentfulrc.json`), {
      managementToken: managementToken,
      activeSpaceId: spaceId,
      activeEnvironmentId: environmentId,
      host: 'api.contentful.com',
    })

    console.log(`Created test/extensions/${extensionId}/.contentfulrc.json`)
    console.log('Created cypress.env.json')
  }

  await Promise.all(['test-extension'].map(writeJSONForExtension))

  writeJSONFile(resolvePath('cypress.env.json'), {
    managementToken: managementToken,
    activeSpaceId: spaceId,
    activeEnvironmentId: environmentId,
  })
}
