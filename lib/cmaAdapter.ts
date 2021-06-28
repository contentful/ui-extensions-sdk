import { Channel } from './channel'
import { Adapter, MakeRequest } from 'contentful-management/types'

const createMakeRequestCall = (channel: Channel): MakeRequest => {
  // todo add real types
  return (opts: unknown) => channel.call('CMA-Adapter-Call', opts)
}

export function createAdapter(channel: Channel): Adapter {
  return {
    makeRequest: createMakeRequestCall(channel),
  }
}
