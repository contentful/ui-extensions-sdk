const activeSpaceId = Cypress.env('activeSpaceId')

export function home() {
  return `/spaces/${activeSpaceId}/home`
}

export function entiriesList() {
  return `/spaces/${activeSpaceId}/entries`
}
