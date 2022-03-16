import { Channel } from './channel'
import {
  EntryListAPI,
  OnEntryListUpdatedHandler,
  OnEntryListUpdatedHandlerProps,
  OnEntryListUpdatedHandlerReturn,
} from './types'

export default function createEntryList(channel: Channel): EntryListAPI {
  let _handler: OnEntryListUpdatedHandler | null = null

  channel.addHandler(
    'entryListUpdated',
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
    const result = await handler(handlerArg)
    return validateResult(result)
  } catch (error) {
    console.error(error)
    return false
  }
}

const validateResult = (result: OnEntryListUpdatedHandlerReturn) => {
  if (result === false || isDataValid(result.data)) {
    return result
  }

  throw new Error(`EntryListResult is not valid.`)
}

const schema: Record<string, (value: unknown) => boolean> = {
  values: (value) =>
    typeof value === 'object' &&
    Object.keys(value as Record<string, unknown>).length > 0 &&
    Object.values(value as Record<string, unknown>).every((item) => typeof item === 'string'),
}

const isDataValid = (data: Record<string, unknown>) => {
  return Object.keys(data).every((key: string) => {
    if (!(key in schema)) {
      throw new Error(`EntryListResult data is invalid. Key "${key}" is not allowed.`)
    }

    if (!schema[key](data[key])) {
      throw new Error(`EntryListResult data is invalid. Invalid value of key "${key}"`)
    }

    return true
  })
}
