export interface AgentContext {
  view: string
  metadata: {
    entryId?: string
    contentTypeId?: string
    lastFocusedFieldId?: string
  }
}

export type LayoutVariant = 'normal' | 'expanded'

export type ToolbarActionName = 'chat.history' | 'chat.back' | 'chat.close'

export interface ToolbarAction {
  name: ToolbarActionName
  action: 'click'
}

export interface AgentAPI {
  onContextChange: (handler: (context: AgentContext) => void) => VoidFunction
  onToolbarAction: (handler: (action: ToolbarAction) => void) => VoidFunction
  setLayoutVariant: (variant: LayoutVariant) => void
}
