const activeSpaceId = Cypress.env('activeSpaceId')
const activeEnvironmentId = Cypress.env('activeEnvironmentId')

export function entriesList() {
  return `/spaces/${activeSpaceId}/environments/${activeEnvironmentId}/entries`
}

export function pageExtension(extensionId) {
  return `/spaces/${activeSpaceId}/environments/${activeEnvironmentId}/extensions/${extensionId}`
}

export function entry(id) {
  const entryURL = `${entriesList()}/${id}`

  console.log(`
    **********


   ENTRY URL=${entryURL}


   **********

  `)
  return entryURL
}

export function assetsList() {
  return `/spaces/${activeSpaceId}/environments/${activeEnvironmentId}/assets`
}

export function asset(id) {
  return `${assetsList()}/${id}`
}
