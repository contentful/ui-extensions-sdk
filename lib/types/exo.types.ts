/**
 * ExO (Experience Orchestration) SDK types.
 */

import { Link } from './utils'

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

export type ExoNodeType = 'experience' | 'fragment' | 'inlineFragment' | 'slot' | 'component'

export interface ExoNodeSnapshot {
  id: string
  nodeType: ExoNodeType
}

export interface SlotDescriptor {
  id: string
  allowedComponentTypeIds: string[]
  currentItems: Array<{ nodeId: string; nodeType: 'fragment' | 'inlineFragment' }>
}

export interface ExoNodeAPI {
  id: string
  nodeType: ExoNodeType
  get(): ExoNodeSnapshot
  onChange(cb: (node: ExoNodeSnapshot) => void): Unsubscribe
  getContentProperty<T = unknown>(key: string): Promise<T>
  setContentProperty<T = unknown>(key: string, value: T): Promise<void>
  onContentPropertyChanged<T = unknown>(key: string, cb: (value: T) => void): Unsubscribe
  getDesignProperty<T extends DesignValue = DesignValue>(key: string): Promise<T>
  setDesignProperty<T extends DesignValue = DesignValue>(key: string, value: T): Promise<void>
  onDesignPropertyChanged<T extends DesignValue = DesignValue>(
    key: string,
    cb: (value: T) => void,
  ): Unsubscribe
  getProperties(): Promise<ComponentPropertyDescriptor[]>
  updateProperty<T = unknown>(key: string, value: T): Promise<void>
  getBinding(key: string): Promise<Binding | null>
  setBinding(key: string, binding: Binding): Promise<void>
  getBindingMetadata(key: string): Promise<ComponentPropertyBinding | null>
  resolveEntryBinding(key: string): Promise<{ entryId: string; fieldId?: string } | null>
  getSlotDescriptor(): Promise<SlotDescriptor | null>
}

export interface ExoSelectionAPI {
  get(): { nodeId: string | null; nodeType?: ExoNodeType }
  onChange(cb: (sel: { nodeId: string | null; nodeType?: ExoNodeType }) => void): Unsubscribe
  set(nodeId: string | null): void
  highlight(nodeId: string, opts?: { flash?: boolean; scrollIntoView?: boolean }): void
}

export interface ExperienceSnapshot {
  sys: {
    id: string
    type: 'Experience'
    version: number
    template: Link<'Template'>
  }
}

export interface ExperienceAPI {
  get(): ExperienceSnapshot
  onChange(cb: (v: ExperienceSnapshot) => void): Unsubscribe
  save(): Promise<void>
  publish(): Promise<void>
  getNode(nodeId: string): ExoNodeAPI | null
  getRootNodes(): ExoNodeAPI[]
  selection: ExoSelectionAPI
  dataAssembly: DataAssemblySDK
}

export interface ExoContext {
  type: 'experience' | 'fragment'
  entityId: string
}

export interface ExoSDK {
  context: ExoContext
  getUiMode(): UiMode
  onUiModeChanged(cb: (mode: UiMode) => void): Unsubscribe
  experience: ExperienceAPI
}
