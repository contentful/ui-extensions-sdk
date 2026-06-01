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

/** A reference to a design token. */
export type DesignTokenValue = {
  type: 'DesignToken'
  value: string
}

/** An inlined design value. */
export type ManualDesignValue = {
  type: 'ManualDesignValue'
  value: string | number | boolean
}

export type DesignValue = DesignTokenValue | ManualDesignValue

export interface ComponentPropertyDescriptor<C = unknown, D extends DesignValue = DesignValue> {
  key: string
  area: 'content' | 'design'
  value: C | D
  binding?: ComponentPropertyBinding
}

/* Data Assembly types */

/** Same-space content source CRN used by Data Assembly ResourceLink parameters. */
export type SameSpaceContentSource = 'crn:contentful:::content:spaces/$self/environments/$self'

/**
 * A reference to a Contentful resource, addressed by `urn`. `linkType` is a `Contentful:`-prefixed
 * resource type (e.g. `'Contentful:Template'`).
 */
export interface ResourceLink<T extends string = string> {
  sys: {
    type: 'ResourceLink'
    linkType: T
    urn: string
  }
}

/** One allowed resource for a Data Assembly ResourceLink parameter. */
export interface AllowedResource {
  type: 'Contentful:Entry'
  source: SameSpaceContentSource
  allowedTypes: string[]
}

/** Definition of a single Data Assembly parameter. */
export interface DataAssemblyParameterDefinition {
  name?: string
  description?: string
  type: 'ResourceLink'
  linkType: 'Contentful:Entry'
  allowedResources: AllowedResource[]
}

/** The value bound to a Data Assembly parameter: a ResourceLink to the referenced entity. */
export type DataAssemblyParameterValue = ResourceLink<'Contentful:Entry'>

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

export interface DataAssemblyAPI {
  /** Returns the current Data Assembly snapshot for the active experience/fragment. */
  get(): DataAssemblySnapshot
  /** Resolves all Data Assembly parameter definitions, keyed by parameter id. */
  getParameters(): Promise<Record<string, DataAssemblyParameter>>
  /** Resolves a single parameter definition, or `null` if no parameter has that id. */
  getParameter(parameterId: string): Promise<DataAssemblyParameter | null>
  /** Resolves the entry bindings currently mapped to Data Assembly parameters. */
  getEntryBindings(): Promise<EntryBindingRef[]>
  /** Sets the value of a single Data Assembly parameter. */
  setParameter(parameterId: string, value: DataAssemblyParameterValue): Promise<void>
  /** Sets multiple Data Assembly parameter values in a single update. */
  setParameters(updates: Partial<Record<string, DataAssemblyParameterValue>>): Promise<void>
  /** Subscribes to Data Assembly snapshot changes. Returns an unsubscribe function. */
  onChange(cb: (snapshot: DataAssemblySnapshot) => void): Unsubscribe
}

/** The type of a node within an experience/fragment tree. */
export type ExoNodeType = 'Component' | 'Fragment' | 'InlineFragment' | 'Slot'

export interface ExoNodeSnapshot {
  id: string
  nodeType: ExoNodeType
}

export interface SlotDescriptor {
  id: string
  allowedComponentTypeIds: string[]
  currentItems: Array<{ nodeId: string; nodeType: 'Fragment' | 'InlineFragment' }>
}

/**
 * API for reading and mutating a single node (component, slot, fragment, etc.) within an
 * experience or fragment tree. Obtained via {@link ExperienceAPI.getNode}.
 */
export interface ExoNodeAPI {
  /** The node's unique id within the experience/fragment tree. */
  id: string
  /** The node's type (component, slot, fragment, etc.). */
  nodeType: ExoNodeType
  /** Returns the current snapshot of this node. */
  get(): ExoNodeSnapshot
  /** Subscribes to changes to this node. Returns an unsubscribe function. */
  onChange(cb: (node: ExoNodeSnapshot) => void): Unsubscribe
  /** Resolves the value of a content property by key. */
  getContentProperty<T = unknown>(key: string): Promise<T>
  /** Sets the value of a content property by key. */
  setContentProperty<T = unknown>(key: string, value: T): Promise<void>
  /** Subscribes to changes of a single content property. Returns an unsubscribe function. */
  onContentPropertyChanged<T = unknown>(key: string, cb: (value: T) => void): Unsubscribe
  /** Resolves the value of a design property by key. */
  getDesignProperty<T extends DesignValue = DesignValue>(key: string): Promise<T>
  /** Sets the value of a design property by key. */
  setDesignProperty<T extends DesignValue = DesignValue>(key: string, value: T): Promise<void>
  /** Subscribes to changes of a single design property. Returns an unsubscribe function. */
  onDesignPropertyChanged<T extends DesignValue = DesignValue>(
    key: string,
    cb: (value: T) => void,
  ): Unsubscribe
  /** Resolves the descriptors for all of the node's component properties. */
  getProperties(): Promise<ComponentPropertyDescriptor[]>
  /** Updates a single property by key (content or design, resolved by the host). */
  updateProperty<T = unknown>(key: string, value: T): Promise<void>
  /** Resolves the binding for a property key, or `null` if the property is not bound. */
  getBinding(key: string): Promise<Binding | null>
  /** Sets the binding for a property key. */
  setBinding(key: string, binding: Binding): Promise<void>
  /** Resolves binding metadata for a property key, or `null` if the property is not bound. */
  getBindingMetadata(key: string): Promise<ComponentPropertyBinding | null>
  /** Resolves the entry a property is bound to, or `null` if it is not an entry binding. */
  resolveEntryBinding(key: string): Promise<{ entryId: string; fieldId?: string } | null>
  /** Resolves the slot descriptor for this node, or `null` if the node is not a slot. */
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
    template: ResourceLink<'Contentful:Template'>
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
  dataAssembly: DataAssemblyAPI
}

export interface ExoContext {
  type: 'experience' | 'fragment'
  entityId: string
}

export interface ExoSDK {
  context: ExoContext
  onContextChanged(cb: (context: ExoContext) => void): Unsubscribe
  getUiMode(): UiMode
  onUiModeChanged(cb: (mode: UiMode) => void): Unsubscribe
  experience: ExperienceAPI
}
