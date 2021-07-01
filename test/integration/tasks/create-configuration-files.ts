import { printStepTitle, resolvePath, writeJSONFile } from '../utils'

export async function createCypressConfiguration({
  managementToken,
  spaceId,
  environmentId,
  aliasId,
  role,
  entries,
}: {
  managementToken: string
  spaceId: string
  environmentId: string
  aliasId: string
  role: string
  entries: Record<string, string>
}) {
  printStepTitle(`${role}: Creating Cypress configuration based on environment variables`)
  writeJSONFile(resolvePath('cypress.env.json'), {
    managementToken,
    activeSpaceId: spaceId,
    activeEnvironmentId: environmentId,
    activeAliasId: aliasId,
    role,
    entries,
  })
  console.log('Created cypress.env.json')
}

export async function createExtensionConfiguration({
  managementToken,
  spaceId,
  environmentId,
  host,
}: {
  managementToken: string
  spaceId: string
  environmentId: string
  host?: string
}) {
  printStepTitle('Creating extension configuration based on environment variables')
  const extensionId = 'test-extension'

  writeJSONFile(resolvePath(`test/extensions/${extensionId}/.contentfulrc.json`), {
    managementToken,
    activeSpaceId: spaceId,
    activeEnvironmentId: environmentId,
    host: host || 'api.contentful.com',
  })

  console.log(`Created test/extensions/${extensionId}/.contentfulrc.json`)
}
