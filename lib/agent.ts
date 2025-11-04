import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { AgentAPI, AgentContext, ConnectMessage } from './types'

export default function createAgent(
  channel: Channel,
  contextData: ConnectMessage['agent'],
): AgentAPI {
  if (!contextData) {
    throw new Error('Context data is required')
  }

  const contextChanged = new MemoizedSignal<[AgentContext]>(contextData)

  channel.addHandler('contextChanged', (newContext: AgentContext) => {
    contextChanged.dispatch(newContext)
  })

  return {
    onContextChange: (handler) => contextChanged.attach(handler),
  }
}
