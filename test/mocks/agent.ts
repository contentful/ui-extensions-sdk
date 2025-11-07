import { AgentContext } from '../../lib/types'

export const mockAgentContext: AgentContext = {
  view: 'entry-editor',
  metadata: {
    entryId: 'test-entry-123',
    contentTypeId: 'test-content-type-456',
    lastFocusedFieldId: 'test-field-789',
  },
}

export const mockAgentContextMinimal: AgentContext = {
  view: 'home',
  metadata: {},
}

export const mockAgentContextWithPartialMetadata: AgentContext = {
  view: 'page',
  metadata: {
    entryId: 'entry-abc',
  },
}
