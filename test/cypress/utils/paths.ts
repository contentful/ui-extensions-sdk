const activeSpaceId = Cypress.env('activeSpaceId')
const activeEnvironmentId = Cypress.env('activeEnvironmentId')
const activeAliasId = Cypress.env('activeAliasId')

export function entriesList() {
  return `/spaces/${activeSpaceId}/environments/${activeEnvironmentId}/entries`
}

export function entriesListAliased() {
  return `/spaces/${activeSpaceId}/environments/${activeAliasId}/entries`
}

export function pageExtensionMaster(extensionId: string) {
  return `/spaces/${activeSpaceId}/extensions/${extensionId}`
}

export function entryAliased(id: string) {
  return `${entriesListAliased()}/${id}`
}

export function pageExtension(extensionId: string) {
  return `/spaces/${activeSpaceId}/environments/${activeEnvironmentId}/extensions/${extensionId}`
}

export function entry(id: string) {
  return `${entriesList()}/${id}`
}

export function assetsList() {
  return `/spaces/${activeSpaceId}/environments/${activeEnvironmentId}/assets`
}

export function asset(id: string) {
  return `${assetsList()}/${id}`
}
