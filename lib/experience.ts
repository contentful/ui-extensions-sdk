import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import {
  ExperienceSDK,
  ExperienceContext,
  Unsubscribe,
  ExperienceSnapshot,
  ExperienceMetadata,
  ExperienceAPI,
  ExperienceNodeAPI,
  ExperienceNodeSnapshot,
  ExperienceNodeType,
  ExperienceSelectionAPI,
  DataAssemblyAPI,
  DataAssemblyParameterAPI,
  DataAssemblySnapshot,
  DataAssemblySummary,
  DataAssemblyParameterDefinition,
  DataAssemblyParameterValue,
  ComponentPropertyDescriptor,
  DesignValue,
  SlotDescriptor,
} from './types'

/**
 * Creates the Experience SDK namespace for the experience-toolbar location.
 *
 * Throws when called without handshake `experiences` data, mirroring `createAgent`. This keeps the
 * public `ExperienceEditorToolbarAppSDK['experiences']` type sound (non-optional, always present).
 */
export default function createExperience(
  channel: Channel,
  experienceInit?: {
    context?: ExperienceContext
    experience?: ExperienceSnapshot
  },
): ExperienceSDK {
  if (experienceInit === undefined) {
    throw new Error('Context data is required')
  }

  const initialContext: ExperienceContext = experienceInit.context ?? {
    type: 'experience',
    entityId: '',
  }
  const contextSignal = new MemoizedSignal<[ExperienceContext]>(initialContext)

  channel.addHandler('exo.contextChanged', (payload: ExperienceContext) => {
    contextSignal.dispatch(payload)
  })

  const experience = createExperienceAPI(channel, experienceInit.experience)

  return {
    get context(): ExperienceContext {
      return contextSignal.getMemoizedArgs()[0]
    },
    onContextChanged(cb: (context: ExperienceContext) => void): Unsubscribe {
      return contextSignal.attach(cb)
    },
    experience,
  }
}

function createExperienceAPI(channel: Channel, initial?: ExperienceSnapshot): ExperienceAPI {
  const initialSnapshot: ExperienceSnapshot = initial ?? {
    sys: {
      id: '',
      type: 'Experience',
      version: 0,
      template: { sys: { type: 'ResourceLink', linkType: 'Contentful:Template', urn: '' } },
    },
  }
  const experienceSignal = new MemoizedSignal<[ExperienceSnapshot]>(initialSnapshot)

  channel.addHandler('exo.experienceChanged', (payload: ExperienceSnapshot) => {
    experienceSignal.dispatch(payload)
  })

  const selection = createSelectionAPI(channel)
  const dataAssembly = createDataAssemblyAPI(channel)

  // Cache node APIs by id and reuse them. Each createNodeAPI() registers a channel handler
  // for `exo.nodeChanged.${nodeId}`, so constructing a fresh one per getNode() call would
  // leak a handler on every call over a long-lived session. Construct-once, reuse by id.
  const nodeApis = new Map<string, ExperienceNodeAPI>()

  // Single source of truth for the nodeApis cache, shared by getNode() and getRootNodes().
  // When `nodeType` is provided and disagrees with a cached instance's type, the cached
  // instance is stale (e.g. seeded as the 'Component' default by getNode() before
  // getRootNodes() resolved its authoritative type) and is replaced.
  function getOrCreateNodeApi(nodeId: string, nodeType?: ExperienceNodeType): ExperienceNodeAPI {
    const cached = nodeApis.get(nodeId)
    if (cached !== undefined && (nodeType === undefined || nodeType === cached.nodeType)) {
      return cached
    }
    const nodeApi = createNodeAPI(channel, nodeId, nodeType)
    nodeApis.set(nodeId, nodeApi)
    return nodeApi
  }

  return {
    get(): ExperienceSnapshot {
      return experienceSignal.getMemoizedArgs()[0]
    },
    onChange(cb: (v: ExperienceSnapshot) => void): Unsubscribe {
      return experienceSignal.attach(cb)
    },
    getMetadata(): ExperienceMetadata | undefined {
      return experienceSignal.getMemoizedArgs()[0].metadata
    },
    setMetadata(patch: Partial<ExperienceMetadata>): Promise<void> {
      return channel.call('exo.setExperienceMetadata', patch)
    },
    onMetadataChanged(cb: (metadata?: ExperienceMetadata) => void): Unsubscribe {
      // Diff-guard the memoized snapshot so sys-only churn doesn't fire a spurious metadata change.
      let previous: string | undefined
      let seeded = false
      return experienceSignal.attach((snapshot) => {
        const next = JSON.stringify(snapshot.metadata)
        if (seeded && next === previous) return
        seeded = true
        previous = next
        cb(snapshot.metadata)
      })
    },
    save(): Promise<void> {
      return channel.call('exo.saveExperience')
    },
    publish(): Promise<void> {
      return channel.call('exo.publishExperience')
    },
    getNode(nodeId: string): ExperienceNodeAPI | null {
      return getOrCreateNodeApi(nodeId)
    },
    getRootNodes(): Promise<ExperienceNodeAPI[]> {
      return channel
        .call<ExperienceNodeSnapshot[]>('exo.getRootNodes')
        .then((snapshots) => snapshots.map((s) => getOrCreateNodeApi(s.id, s.nodeType)))
    },
    selection,
    dataAssembly,
  }
}

function createNodeAPI(
  channel: Channel,
  nodeId: string,
  nodeType: ExperienceNodeType = 'Component',
): ExperienceNodeAPI {
  const nodeSignal = new MemoizedSignal<[ExperienceNodeSnapshot]>({ id: nodeId, nodeType })

  channel.addHandler(`exo.nodeChanged.${nodeId}`, (payload: ExperienceNodeSnapshot) => {
    nodeSignal.dispatch(payload)
  })

  return {
    id: nodeId,
    nodeType,
    get(): ExperienceNodeSnapshot {
      return nodeSignal.getMemoizedArgs()[0]
    },
    onChange(cb: (node: ExperienceNodeSnapshot) => void): Unsubscribe {
      return nodeSignal.attach(cb)
    },
    dataAssembly: createParameterAPI(channel, NODE_DA_SCOPE, nodeId),
    getDesignProperty<T extends DesignValue = DesignValue>(key: string): Promise<T> {
      return channel.call<T>('exo.getNodeDesignProperty', nodeId, key)
    },
    setDesignProperty<T extends DesignValue = DesignValue>(key: string, value: T): Promise<void> {
      return channel.call<void>('exo.setNodeDesignProperty', nodeId, key, value)
    },
    onDesignPropertyChanged<T extends DesignValue = DesignValue>(
      key: string,
      cb: (value: T) => void,
    ): Unsubscribe {
      return channel.addHandler(`exo.nodeDesignPropertyChanged.${nodeId}.${key}`, cb)
    },
    getProperties(): Promise<ComponentPropertyDescriptor[]> {
      return channel.call<ComponentPropertyDescriptor[]>('exo.getNodeProperties', nodeId)
    },
    getSlotDescriptor(): Promise<SlotDescriptor | null> {
      return channel.call<SlotDescriptor | null>('exo.getNodeSlotDescriptor', nodeId)
    },
  }
}

function createSelectionAPI(channel: Channel): ExperienceSelectionAPI {
  const selectionSignal = new MemoizedSignal<
    [{ nodeId: string | null; nodeType?: ExperienceNodeType }]
  >({
    nodeId: null,
  })

  channel.addHandler(
    'exo.selectionChanged',
    (payload: { nodeId: string | null; nodeType?: ExperienceNodeType }) => {
      selectionSignal.dispatch(payload)
    },
  )

  return {
    get(): { nodeId: string | null; nodeType?: ExperienceNodeType } {
      return selectionSignal.getMemoizedArgs()[0]
    },
    onChange(
      cb: (sel: { nodeId: string | null; nodeType?: ExperienceNodeType }) => void,
    ): Unsubscribe {
      return selectionSignal.attach(cb)
    },
    set(nodeId: string | null): void {
      channel.send('exo.setSelection', { nodeId })
    },
    highlight(nodeId: string, opts?: { flash?: boolean; scrollIntoView?: boolean }): void {
      channel.send('exo.highlightNode', { nodeId, ...opts })
    },
  }
}

/**
 * Builds the parameter definition/value methods shared by the experience-level
 * {@link DataAssemblyAPI} and the node-scoped surface on {@link ExperienceNodeAPI}. `args` are
 * prepended to every channel call so a node-scoped API can carry its `nodeId` while the
 * experience-level one carries none.
 */
function createParameterAPI(
  channel: Channel,
  scope: { definitions: string; definition: string; setValue: string; setValues: string },
  ...args: unknown[]
): DataAssemblyParameterAPI {
  return {
    getParameterDefinitions(): Promise<Record<string, DataAssemblyParameterDefinition>> {
      return channel.call(scope.definitions, ...args)
    },
    getParameterDefinition(parameterId: string): Promise<DataAssemblyParameterDefinition | null> {
      return channel.call(scope.definition, ...args, parameterId)
    },
    setParameterValue(parameterId: string, value: DataAssemblyParameterValue): Promise<void> {
      return channel.call(scope.setValue, ...args, parameterId, value)
    },
    setParameterValues(
      updates: Partial<Record<string, DataAssemblyParameterValue>>,
    ): Promise<void> {
      return channel.call(scope.setValues, ...args, updates)
    },
  }
}

const EXPERIENCE_DA_SCOPE = {
  definitions: 'exo.getDataAssemblyParameterDefinitions',
  definition: 'exo.getDataAssemblyParameterDefinition',
  setValue: 'exo.setDataAssemblyParameterValue',
  setValues: 'exo.setDataAssemblyParameterValues',
}

const NODE_DA_SCOPE = {
  definitions: 'exo.getNodeParameterDefinitions',
  definition: 'exo.getNodeParameterDefinition',
  setValue: 'exo.setNodeParameterValue',
  setValues: 'exo.setNodeParameterValues',
}

function createDataAssemblyAPI(channel: Channel): DataAssemblyAPI {
  const initialSnapshot: DataAssemblySnapshot = { id: '', parameters: {} }
  const dataAssemblySignal = new MemoizedSignal<[DataAssemblySnapshot]>(initialSnapshot)

  channel.addHandler('exo.dataAssemblyChanged', (payload: DataAssemblySnapshot) => {
    dataAssemblySignal.dispatch(payload)
  })

  return {
    get(): DataAssemblySnapshot {
      return dataAssemblySignal.getMemoizedArgs()[0]
    },
    getAvailable(): Promise<DataAssemblySummary[]> {
      return channel.call('exo.getAvailableDataAssemblies')
    },
    ...createParameterAPI(channel, EXPERIENCE_DA_SCOPE),
    onChange(cb: (snapshot: DataAssemblySnapshot) => void): Unsubscribe {
      return dataAssemblySignal.attach(cb)
    },
  }
}
