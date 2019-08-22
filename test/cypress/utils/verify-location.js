import locations from '../../../lib/locations'

export function verifyLocation(sdk, location) {
  expect(sdk.location.is(location)).to.equal(true)
  let invalidLocations = Object.values(locations)
  invalidLocations = invalidLocations.filter(item => item !== location)
  invalidLocations.push('test-value')
  invalidLocations.forEach(item => expect(sdk.location.is(item)).to.equal(false))
}
