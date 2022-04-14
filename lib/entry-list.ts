import { Channel } from './channel'
import {
  EntryListAPI,
  OnEntryListUpdatedHandler,
  OnEntryListUpdatedHandlerProps,
  OnEntryListUpdatedHandlerReturn,
} from './types'

interface Message {
  msgId: string
  props: OnEntryListUpdatedHandlerProps
}

export default function createEntryList(channel: Channel): EntryListAPI {
  let _handler: OnEntryListUpdatedHandler | undefined
  let cachedMessage: Message | undefined

  const entryListUpdatedHandler = async (message: Message) => {
    cachedMessage = message

    if (!_handler) {
      return
    }

    const result = await runHandler(_handler, message.props)
    return channel.send('entryListResult', { msgId: message.msgId, result })
  }

  channel.addHandler('entryListUpdated', entryListUpdatedHandler)

  return {
    onEntryListUpdated(handler: OnEntryListUpdatedHandler) {
      if (typeof handler !== 'function') {
        throw new Error('OnEntryListUpdated handler must be a function')
      }

      _handler = handler
      if (cachedMessage) {
        entryListUpdatedHandler(cachedMessage)
      }
    },
  }
}

const runHandler = async (
  handler: OnEntryListUpdatedHandler,
  handlerArg: OnEntryListUpdatedHandlerProps
) => {
  try {
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

  if (typeof result === 'object') {
    validateData(result)
    return
  }

  throw new Error(`Entry List location app data is invalid.`)
}

const schema: Record<string, (value: unknown) => void> = {
  values: (value) => {
    if (typeof value !== 'object') {
      throw new Error(`Entry List location app data is invalid: 'values' should be an object.`)
    }

    const values = Object.values(value as Record<string, unknown>)
    if (values.length === 0) {
      // we allow passing empty values object
      return
    }

    const areValuesValid = values.every((item) => typeof item === 'string')
    if (!areValuesValid) {
      throw new Error(
        `Entry List location app data is invalid: 'values' object should have a values of type 'string'.`
      )
    }
  },
}

const validateData = (data: Record<string, unknown>) => {
  const dataKeys = Object.keys(data)

  if (dataKeys.length === 0) {
    throw new Error(`Entry List location app data is invalid.`)
  }

  dataKeys.forEach((key: string) => {
    if (!(key in schema)) {
      throw new Error(`Entry List location app data is invalid. Key '${key}' is not allowed.`)
    }

    schema[key](data[key])
  })
}
