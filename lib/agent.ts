import { Channel } from './channel'
import { MemoizedSignal, Signal } from './signal'
import { AgentAPI, AgentContext, ConnectMessage, ToolbarAction } from './types'
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

  return {
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
