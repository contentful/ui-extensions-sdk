import locations from '../../../lib/locations'

export function verifyLocation(sdk, location) {
  expect(sdk.location.is(location)).to.equal(true)
  let invalidLocations = Object.values(locations)
  invalidLocations = invalidLocations.filter(item => item !== location)
  invalidLocations.push('test-value')
  console.log(invalidLocations)
  invalidLocations.every(item => expect(sdk.location.is(item)).to.equal(false))
}
