const activeSpaceId = Cypress.env('activeSpaceId')
const activeEnvironmentId = Cypress.env('activeEnvironmentId')

export function entriesList() {
  return `/spaces/${activeSpaceId}/environments/${activeEnvironmentId}/entries`
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
