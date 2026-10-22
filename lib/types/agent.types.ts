import { SerializedJSONValue } from './utils'

export interface AgentContext {
  view: string
  metadata: {
    entryId?: string
    contentTypeId?: string
    lastFocusedFieldId?: string
    experienceId?: string
    variantId?: string
    experienceFragmentId?: string
    componentId?: string
    experienceTemplateId?: string
  }
}

export type LayoutVariant = 'expanded' | 'normal'

export type ToolbarActionName = 'chat.history' | 'chat.back' | 'chat.close' | 'chat.new'

export interface ToolbarAction {
  name: ToolbarActionName
  action: 'click'
}

/** `payload` is untrusted; declare its type with `type`, not `interface`. */
export interface AgentInvocation<T extends SerializedJSONValue = SerializedJSONValue> {
  id: string
  payload: T
  sender: { appDefinitionId: string }
}

export interface AgentAPI {
  onContextChange: (handler: (context: AgentContext) => void) => VoidFunction
  /** Single handler only; a second call throws until the first is detached. */
  onInvocation: <T extends SerializedJSONValue = SerializedJSONValue>(
    handler: (invocation: AgentInvocation<T>) => void | Promise<void>,
  ) => VoidFunction
  onToolbarAction: (handler: (action: ToolbarAction) => void) => VoidFunction
  onAgentLayoutVariantChange: (handler: (variant: LayoutVariant) => void) => VoidFunction
  setAgentLayoutVariant: (variant: LayoutVariant) => void
}
