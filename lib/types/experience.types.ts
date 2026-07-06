/**
 * Experience SDK types.
 */

export type Unsubscribe = () => void

export type UiMode = 'form' | 'visual'

/* Bindings + property descriptors */

export type EntryBinding = {
  type: 'entry'
  entryId: string
  fieldId: string
  locale?: string
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

/**
 * Describes a single component property: its key, area, current value, and binding.
 * `area` distinguishes content properties (bound to entry fields / authored content)
 * from design properties (presentation values, e.g. design tokens) — the same split
 * the Experience domain model and editor model natively, letting an app render them separately.
 * `binding`, when present, is an `EntryBinding` carrying the `entryId`/`fieldId` a
 * consumer needs to resolve the backing entry; omitted when the property is unbound.
 */
export interface ComponentPropertyDescriptor<C = unknown, D extends DesignValue = DesignValue> {
  key: string
  area: 'content' | 'design'
  value: C | D
  binding?: EntryBinding
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

export interface DataAssemblySnapshot {
  id: string
  name?: string
  parameters: Record<string, DataAssemblyParameterDefinition>
}

/**
 * A Data Assembly available within the current experience/fragment, with its parameter
 * definitions. Returned by {@link DataAssemblyAPI.getAvailable}. Definition-only — no GraphQL
 * resolvers, `return` mapping, or nested DAs.
 */
export interface DataAssemblySummary {
  id: string
  name: string
  description?: string
  parameters: Record<string, DataAssemblyParameterDefinition>
}

/**
 * Reads parameter definitions and writes parameter values for a Data Assembly. A parameter's
 * *definition* (its allowed resources, name, description) and its *value* (the entry bound to it)
 * are distinct concepts, reflected in the method names: `get*Definition*` reads, `set*Value*` writes.
 */
export interface DataAssemblyParameterAPI {
  /** Resolves all Data Assembly parameter definitions, keyed by parameter id. */
  getParameterDefinitions(): Promise<Record<string, DataAssemblyParameterDefinition>>
  /** Resolves a single parameter definition, or `null` if no parameter has that id. */
  getParameterDefinition(parameterId: string): Promise<DataAssemblyParameterDefinition | null>
  /** Sets the value of a single Data Assembly parameter. */
  setParameterValue(parameterId: string, value: DataAssemblyParameterValue): Promise<void>
  /** Sets multiple Data Assembly parameter values in a single update. */
  setParameterValues(updates: Partial<Record<string, DataAssemblyParameterValue>>): Promise<void>
}

export interface DataAssemblyAPI extends DataAssemblyParameterAPI {
  /** Returns the current Data Assembly snapshot for the active experience/fragment. */
  get(): DataAssemblySnapshot
  /**
   * Resolves the Data Assemblies available in the current experience/fragment, each with its
   * parameter definitions. Discovery counterpart to {@link get}, which returns only the active DA.
   */
  getAvailable(): Promise<DataAssemblySummary[]>
  /** Subscribes to Data Assembly snapshot changes. Returns an unsubscribe function. */
  onChange(cb: (snapshot: DataAssemblySnapshot) => void): Unsubscribe
}

/** The type of a node within an experience/fragment tree. */
export type ExperienceNodeType = 'Component' | 'Fragment' | 'InlineFragment' | 'Slot'

export interface ExperienceNodeSnapshot {
  id: string
  nodeType: ExperienceNodeType
}

/** One allowed resource for a slot: the Component(s) that may be placed in it. */
export interface SlotAllowedResource {
  type: 'Contentful:ComponentType'
  source: string
  allowedTypes: string[]
}

export interface SlotDescriptor {
  id: string
  allowedResources: SlotAllowedResource[]
  currentItems: Array<{ nodeId: string; nodeType: 'Fragment' | 'InlineFragment' }>
}

/**
 * API for reading and mutating a single node (component, slot, fragment, etc.) within an
 * experience or fragment tree. Obtained via {@link ExperienceAPI.getNode}.
 */
export interface ExperienceNodeAPI {
  /** The node's unique id within the experience/fragment tree. */
  id: string
  /** The node's type (component, slot, fragment, etc.). */
  nodeType: ExperienceNodeType
  /** Returns the current snapshot of this node. */
  get(): ExperienceNodeSnapshot
  /** Subscribes to changes to this node. Returns an unsubscribe function. */
  onChange(cb: (node: ExperienceNodeSnapshot) => void): Unsubscribe
  /**
   * Reads parameter definitions and writes parameter values for this node's Data Assembly.
   * A node's content is populated through Data Assembly parameters, not free-form content
   * properties — so content is read/written here. Only meaningful for inline-fragment nodes;
   * other node types have no Data Assembly and these calls resolve empty / are no-ops.
   */
  dataAssembly: DataAssemblyParameterAPI
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
  /** Resolves the slot descriptor for this node, or `null` if the node is not a slot. */
  getSlotDescriptor(): Promise<SlotDescriptor | null>
}

export interface ExperienceSelectionAPI {
  get(): { nodeId: string | null; nodeType?: ExperienceNodeType }
  onChange(cb: (sel: { nodeId: string | null; nodeType?: ExperienceNodeType }) => void): Unsubscribe
  set(nodeId: string | null): void
  highlight(nodeId: string, opts?: { flash?: boolean; scrollIntoView?: boolean }): void
}

/**
 * Snapshot of the root entity being edited. Discriminated on `sys.type`:
 * an `Experience` (optionally backed by a template) or a `Fragment` (no template).
 * Mirrors the canonical `experiences-api-schemas` shapes — `Experience.sys.template`
 * is optional there, and `Fragment.sys` carries a `componentType` ResourceLink and no template.
 */
export type ExperienceSnapshot =
  | {
      sys: {
        id: string
        type: 'Experience'
        version: number
        template?: ResourceLink<'Contentful:Template'>
      }
    }
  | {
      sys: {
        id: string
        type: 'Fragment'
        version: number
        componentType: ResourceLink<'Contentful:ComponentType'>
      }
    }

export interface ExperienceAPI {
  get(): ExperienceSnapshot
  onChange(cb: (v: ExperienceSnapshot) => void): Unsubscribe
  save(): Promise<void>
  publish(): Promise<void>
  getNode(nodeId: string): ExperienceNodeAPI | null
  getRootNodes(): ExperienceNodeAPI[]
  selection: ExperienceSelectionAPI
  dataAssembly: DataAssemblyAPI
}

export interface ExperienceContext {
  type: 'experience' | 'fragment'
  entityId: string
}

export interface ExperienceSDK {
  context: ExperienceContext
  onContextChanged(cb: (context: ExperienceContext) => void): Unsubscribe
  getUiMode(): UiMode
  onUiModeChanged(cb: (mode: UiMode) => void): Unsubscribe
  experience: ExperienceAPI
}
