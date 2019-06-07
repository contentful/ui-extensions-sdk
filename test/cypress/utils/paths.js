const activeSpaceId = Cypress.env('activeSpaceId')
const activeEnvironmentId = Cypress.env('activeEnvironmentId')

export function entiriesList() {
  return `/spaces/${activeSpaceId}/environments/${activeEnvironmentId}/entries`
}

export function entry(id) {
  return `${entiriesList()}/${id}`
}
