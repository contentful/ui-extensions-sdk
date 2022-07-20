import { Signal } from './signal'
import { ConnectMessage } from './types'

export function connect(
  currentGlobal: typeof globalThis,
  onConnect: (channel: Channel, message: ConnectMessage, messageQueue: unknown[]) => void
) {
  waitForConnect(currentGlobal, (params: ConnectMessage, messageQueue: unknown[]) => {
    const channel = new Channel(params.id, currentGlobal)
    onConnect(channel, params, messageQueue)
  })
}

function waitForConnect(currentGlobal: typeof globalThis, onConnect: Function) {
  currentGlobal.addEventListener('message', listener)

  function listener(event: MessageEvent) {
    const message = event.data
    if (message.method === 'connect') {
      currentGlobal.removeEventListener('message', listener)
      onConnect(...message.params)
    }
  }
}

export class Channel {
  private _messageHandlers: { [method: string]: Signal } = {}
  private _responseHandlers: {
    [method: string]: {
      resolve: (value: any) => void
      reject: (reason?: any) => void
    }
  } = {}

  private _send: ReturnType<typeof createSender>

  constructor(sourceId: string, currentGlobal: typeof globalThis) {
    this._send = createSender(sourceId, currentGlobal.parent)

    currentGlobal.addEventListener('message', (event: MessageEvent) => {
      this._handleMessage(event.data)
    })
  }

  // call method with name `method` exposed by contentful web app `window`
  call<T = unknown>(method: string, ...params: any[]): Promise<T> {
    const messageId = this._send(method, params)
    return new Promise((resolve, reject) => {
      this._responseHandlers[messageId] = { resolve, reject }
    })
  }

  send(method: string, ...params: any[]) {
    this._send(method, params)
  }

  addHandler(method: string, handler: Function) {
    if (!(method in this._messageHandlers)) {
      this._messageHandlers[method] = new Signal()
    }
    return this._messageHandlers[method].attach(handler)
  }

  private _handleMessage(message: any) {
    if (message.method) {
      const { method, params } = message
      const handlers = this._messageHandlers[method]
      if (handlers) {
        handlers.dispatch(...params)
      }
    } else {
      const { id } = message
      const responseHandler = this._responseHandlers[id]
      if (!responseHandler) {
        return
      }
      if ('result' in message) {
        responseHandler.resolve(message.result)
      } else if ('error' in message) {
        // TODO We should wrap this in an Error instance
        responseHandler.reject(message.error)
      }
      delete this._responseHandlers[id]
    }
  }
}

function createSender(sourceId: string, targetWindow: Window) {
  let messageCount = 0
  return function send(method: string, params: any) {
    const messageId = messageCount++

    try {
      targetWindow.postMessage(
        {
          source: sourceId,
          id: messageId,
          method,
          params,
        },
        '*'
      )
    } catch (e) {
      if (e instanceof DOMException && e.name === 'DataCloneError' && method === 'openDialog') {
        console.error(
          'Error: openCurrent[App] parameters could not be parsed. You likely tried to pass functions or DOM elements as a parameter. Tip: Use the App SDK directly within the dialog location.\n\nLearn more about the dialog location: https://ctfl.io/app-sdk-dialog'
        )
      }

      throw e
    }

    return messageId
  }
}

export function sendInitMessage(currentGlobal: typeof globalThis) {
  const targetWindow = currentGlobal.parent

  // The app is not connected yet so we can't provide an `id` or `source`
  targetWindow.postMessage(
    {
      method: 'init',
    },
    '*'
  )
}
