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

  let context: AgentContext = contextData

  const contextChanged = new MemoizedSignal<[AgentContext]>(context)

  channel.addHandler('contextChanged', (newContext: AgentContext) => {
    context = newContext
    contextChanged.dispatch(context)
  })

  return {
    onContextChange: (handler) => contextChanged.attach(handler),
  }
}
