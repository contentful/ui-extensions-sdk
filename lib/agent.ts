import { Channel } from './channel'
import { MemoizedSignal, Signal } from './signal'
import { AgentAPI, AgentContext, ConnectMessage, ToolbarAction } from './types'

export default function createAgent(
  channel: Channel,
  contextData: ConnectMessage['agent'],
): AgentAPI {
  if (!contextData) {
    throw new Error('Context data is required')
  }

  const contextChanged = new MemoizedSignal<[AgentContext]>(contextData)

  const toolbarActionSignal = new Signal<[ToolbarAction]>()

  channel.addHandler('contextChanged', (newContext: AgentContext) => {
    contextChanged.dispatch(newContext)
  })

  channel.addHandler('toolbarAction', (action: ToolbarAction) => {
    toolbarActionSignal.dispatch(action)
  })

  return {
    onContextChange: (handler) => contextChanged.attach(handler),
    onToolbarAction: (handler) => toolbarActionSignal.attach(handler),
  }
}
