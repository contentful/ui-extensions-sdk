import { Channel } from './channel'
import { MemoizedSignal, Signal } from './signal'
import { AgentAPI, AgentContext, AgentInvocation, ConnectMessage, ToolbarAction } from './types'
import { LayoutVariant } from './types/agent.types'

export default function createAgent(
  channel: Channel,
  contextData: ConnectMessage['agent'],
): AgentAPI {
  if (!contextData) {
    throw new Error('Context data is required')
  }

  const contextChanged = new MemoizedSignal<[AgentContext]>(contextData)

  const toolbarActionSignal = new Signal<[ToolbarAction]>()

  const agentLayoutVariantChanged = new MemoizedSignal<[LayoutVariant]>('normal')

  channel.addHandler('contextChanged', (newContext: AgentContext) => {
    contextChanged.dispatch(newContext)
  })

  channel.addHandler('toolbarAction', (action: ToolbarAction) => {
    toolbarActionSignal.dispatch(action)
  })

  channel.addHandler('agentLayoutVariantChanged', (variant: LayoutVariant) => {
    agentLayoutVariantChanged.dispatch(variant)
  })

  // Buffered because Signal drops events dispatched before a listener attaches.
  type Handler = Parameters<AgentAPI['onInvocation']>[0]
  let invocationHandler: Handler | undefined
  let pendingInvocation: AgentInvocation | undefined
  let lastInvocationId: string | undefined

  function consume(invocation: AgentInvocation, handler: Handler) {
    pendingInvocation = undefined
    lastInvocationId = invocation.id
    const sendResult = (error?: unknown) =>
      channel.send(
        'agentInvocationResult',
        error === undefined
          ? { id: invocation.id }
          : { id: invocation.id, error: error instanceof Error ? error.message : String(error) },
      )

    try {
      Promise.resolve(handler(invocation)).then(
        () => sendResult(),
        (error) =>
          sendResult(error === undefined ? new Error('Invocation handler rejected') : error),
      )
    } catch (error) {
      sendResult(error)
    }
  }

  channel.addHandler('agentInvocation', (invocation: AgentInvocation) => {
    if (invocation.id === lastInvocationId || invocation.id === pendingInvocation?.id) return
    if (invocationHandler) {
      consume(invocation, invocationHandler)
    } else {
      if (pendingInvocation) {
        channel.send('agentInvocationResult', {
          id: pendingInvocation.id,
          error: 'Superseded by a newer invocation',
        })
      }
      pendingInvocation = invocation
    }
  })

  return {
    onInvocation: (handler) => {
      if (typeof handler !== 'function') {
        throw new Error('listener function expected')
      }
      if (invocationHandler) {
        throw new Error('An invocation handler is already registered. Detach it first.')
      }
      invocationHandler = handler
      if (pendingInvocation) {
        consume(pendingInvocation, invocationHandler)
      }
      return () => {
        if (invocationHandler === handler) invocationHandler = undefined
      }
    },
    onContextChange: (handler) => contextChanged.attach(handler),
    onToolbarAction: (handler) => toolbarActionSignal.attach(handler),
    onAgentLayoutVariantChange: (handler) => agentLayoutVariantChanged.attach(handler),
    setAgentLayoutVariant: (variant: LayoutVariant) => {
      if (variant !== 'expanded' && variant !== 'normal') {
        throw new Error(`Invalid layout variant "${variant}". Expected "expanded" or "normal".`)
      }
      channel.send('setAgentLayoutVariant', variant)
    },
  }
}
