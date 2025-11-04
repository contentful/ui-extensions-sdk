export interface AgentContext {
  view: string
  metadata: {
    entryId?: string
    contentTypeId?: string
    lastFocusedFieldId?: string
  }
}

export interface AgentAPI {
  onContextChange: (handler: (context: AgentContext) => void) => VoidFunction
}
