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
    async ({ msgId, props }: { msgId: string; props: OnEntryListUpdatedHandlerProps }) => {
      const result = await runHandler(_handler, props)
      return channel.send('entryListResult', { msgId, result })
    }
  )

  return {
    onEntryListUpdated(handler: OnEntryListUpdatedHandler) {
      if (!(typeof handler === 'function')) {
        throw new Error('OnEntryListUpdated handler must be a function')
      }

      _handler = handler
    },
  }
}

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
    validateResult(result)

    return result
  } catch (error) {
    console.error(error)
    return false
  }
}

const validateResult = (result: OnEntryListUpdatedHandlerReturn) => {
  if (result === false) {
    return
  }

  if (typeof result === 'object' && result.data) {
    validateData(result.data)
    return
  }

  throw new Error(`EntryListResult is not valid.`)
}

const schema: Record<string, (value: unknown) => boolean> = {
  values: (value) =>
    typeof value === 'object' &&
    Object.keys(value as Record<string, unknown>).length > 0 &&
    Object.values(value as Record<string, unknown>).every((item) => typeof item === 'string'),
}

const validateData = (data: Record<string, unknown>) => {
  const dataKeys = Object.keys(data)

  if (dataKeys.length === 0) {
    throw new Error(`EntryListResult data is invalid.`)
  }

  dataKeys.forEach((key: string) => {
    if (!(key in schema)) {
      throw new Error(`EntryListResult data is invalid. Key "${key}" is not allowed.`)
    }

    if (!schema[key](data[key])) {
      throw new Error(`EntryListResult data is invalid. Invalid value of key "${key}."`)
    }
  })
}
