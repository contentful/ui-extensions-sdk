/**
 * ExO (Experience Orchestration) SDK types.
 */

export type Unsubscribe = () => void

export type UiMode = 'form' | 'visual'

/* Bindings + property descriptors */

export type BindingSourceType = 'entry' | 'manual' | 'experience'

export type EntryBinding = {
  type: 'entry'
  entryId: string
  fieldId: string
  locale?: string
}

export type ManualBinding = {
  type: 'manual'
}

export type ExperienceBinding = {
  type: 'experience'
  source?: string // reserved
}

export type Binding = EntryBinding | ManualBinding | ExperienceBinding

export interface ComponentPropertyBinding {
  sourceType: BindingSourceType
  entryId?: string
  fieldId?: string
}

export type DesignTokenValue = {
  type: 'token'
  tokenId: string
  tokenKey: string
}

export type ManualDesignValue = {
  type: 'manual'
  value: string | number
}

export type DesignValue = DesignTokenValue | ManualDesignValue

export interface ComponentPropertyDescriptor<C = unknown, D extends DesignValue = DesignValue> {
  key: string
  area: 'content' | 'design'
  value: C | D
  binding?: ComponentPropertyBinding
}

/* Data Assembly types */

export type LinkType = 'Entry' | 'Asset'

export type DataAssemblyParameterDefinition =
  | {
      type: 'Link'
      linkType: LinkType
      allowedContentTypes?: string[]
    }
  | {
      type: 'ResourceLink'
      allowedResources: Array<{
        type: string
        contentTypes?: string[]
        source?: string
      }>
    }

export type DataAssemblyParameterValue =
  | {
      sys: {
        type: 'Link'
        linkType: LinkType
        id: string
      }
    }
  | {
      sys: {
        type: 'ResourceLink'
        id: string
      }
    }

export interface DataAssemblyParameter {
  id: string
  definition: DataAssemblyParameterDefinition
  value?: DataAssemblyParameterValue | null
}

export interface DataAssemblySnapshot {
  id: string
  name?: string
  parameters: Record<string, DataAssemblyParameter>
}

export interface EntryBindingRef {
  parameterId: string
  entryId: string
}

export interface DataAssemblySDK {
  get(): DataAssemblySnapshot
  getParameters(): Promise<Record<string, DataAssemblyParameter>>
  getParameter(parameterId: string): Promise<DataAssemblyParameter | null>
  getEntryBindings(): Promise<EntryBindingRef[]>
  setParameter(parameterId: string, value: DataAssemblyParameterValue): Promise<void>
  setParameters(updates: Partial<Record<string, DataAssemblyParameterValue>>): Promise<void>
  onChange(cb: (snapshot: DataAssemblySnapshot) => void): Unsubscribe
}

/* Experience snapshot — entity shape aligned with DX-499/DX-500 contracts */
export interface ExperienceSnapshot {
  sys: {
    id: string
    type: 'Experience'
    version: number
  }
}

/* Node-level property access for a single component node within the experience */
export interface ExoNodeAPI {
  getContentProperty(key: string): Promise<ComponentPropertyDescriptor | null>
  setContentProperty(key: string, value: unknown): Promise<void>
  getDesignProperty(key: string): Promise<ComponentPropertyDescriptor | null>
  setDesignProperty(key: string, value: unknown): Promise<void>
}

/* Selection state API */
export interface ExoSelectionAPI {
  get(): { nodeId: string } | null
  onChange(cb: (selection: { nodeId: string } | null) => void): Unsubscribe
  set(nodeId: string): void
  highlight(nodeId: string): void
}

/* The sdk.exo.experience sub-namespace */
export interface ExperienceAPI {
  get(): ExperienceSnapshot
  onChange(cb: (v: ExperienceSnapshot) => void): Unsubscribe
  save(): Promise<void>
  publish(): Promise<void>
  getNode(nodeId: string): ExoNodeAPI | null
  selection: ExoSelectionAPI
  dataAssembly: DataAssemblySDK
}

export interface ExoSDK {
  getUiMode(): UiMode
  onUiModeChanged(cb: (mode: UiMode) => void): Unsubscribe
  experience: ExperienceAPI
}
