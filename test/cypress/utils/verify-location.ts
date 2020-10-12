import locations from '../../../lib/locations'
import { BaseExtensionSDK } from '../../../lib/types'

export function verifyLocation(sdk: BaseExtensionSDK, location: string) {
  expect(sdk.location.is(location)).to.equal(true)
  let invalidLocations = Object.values(locations)
  invalidLocations = invalidLocations.filter(item => item !== location)
  invalidLocations.push('invalid-location' as any)
  invalidLocations.forEach(item => expect(sdk.location.is(item)).to.equal(false))
}
