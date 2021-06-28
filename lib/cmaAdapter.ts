import { Channel } from './channel'
import { Adapter, MakeRequest, MakeRequestWithUserAgent } from 'contentful-management/types'

const createMakeRequestCall = (channel: Channel): MakeRequestWithUserAgent => {
  return (opts: any) => channel.call('CMAAdapterCall', opts) as any
}

export function createAdapter(channel: Channel): Adapter {
  return {
    makeRequest: createMakeRequestCall(channel),
  }
}
