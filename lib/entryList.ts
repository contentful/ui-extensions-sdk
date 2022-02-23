import { Channel } from './channel'
import {
  EntryListAPI,
  OnEntryListUpdatedHandler,
  OnEntryListUpdatedHandlerProps,
  OnEntryListUpdatedHandlerReturn,
} from './types'

const isFunction = (f: any) => typeof f === 'function'

const runHandler = async (
  handler: OnEntryListUpdatedHandler | null,
  handlerArg: OnEntryListUpdatedHandlerProps
) => {
  try {
    // Handler was not registered. Registering a handler is required.
    if (!handler) {
      throw new Error('Registering an onEntryListUpdated handler is required')
    }

    // await will accept both async and sync functions, no need for the isPromise check
    return await handler(handlerArg)
  } catch (error) {
    console.error(error)
    return false
  }
}

export default function createEntryList(channel: Channel): EntryListAPI {
  let _handler: OnEntryListUpdatedHandler | null = null

  channel.addHandler(
    'entryList',
    ({ msgId, props }: { msgId: string; props: OnEntryListUpdatedHandlerProps }) => {
      return runHandler(_handler, props).then((result: OnEntryListUpdatedHandlerReturn) => {
        return channel.send('entryListResult', { msgId, result })
      })
    }
  )

  return {
    onEntryListUpdated(handler: OnEntryListUpdatedHandler) {
      if (!isFunction(handler)) {
        throw new Error('OnEntryListUpdated handler must be a function')
      } else {
        _handler = handler
      }
    },
  }
}
