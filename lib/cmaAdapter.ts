import { Channel } from './channel'
import { Adapter, MakeRequestOptions, MakeRequestWithUserAgent } from 'contentful-management/types'

const createMakeRequestCall = (channel: Channel): MakeRequestWithUserAgent => {
  return (opts: MakeRequestOptions) => channel.call('CMAAdapterCall', opts) as Promise<any>
}

export function createAdapter(channel: Channel): Adapter {
  return {
    makeRequest: createMakeRequestCall(channel),
  }
}
