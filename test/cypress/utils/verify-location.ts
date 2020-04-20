import locations from '../../../lib/locations'

export function verifyLocation(sdk, location) {
  expect(sdk.location.is(location)).to.equal(true)
  let invalidLocations = (Object as any).values(locations)
  invalidLocations = invalidLocations.filter(item => item !== location)
  invalidLocations.push('invalid-location' as any)
  invalidLocations.forEach(item => expect(sdk.location.is(item)).to.equal(false))
}
