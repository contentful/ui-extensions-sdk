import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import {
  ExoSDK,
  ExoContext,
  UiMode,
  Unsubscribe,
  ExperienceSnapshot,
  ExperienceAPI,
  ExoNodeAPI,
  ExoNodeSnapshot,
  ExoNodeType,
  ExoSelectionAPI,
  DataAssemblyAPI,
  DataAssemblySnapshot,
  DataAssemblyParameter,
  DataAssemblyParameterValue,
  EntryBindingRef,
  ComponentPropertyDescriptor,
  DesignValue,
  Binding,
  SlotDescriptor,
} from './types'

/**
 * Creates the ExO (Experience Orchestration) SDK namespace for the experience-toolbar location.
 *
 * Throws when called without handshake `exo` data, mirroring `createAgent`. This keeps the
 * public `ExperienceEditorToolbarAppSDK['exo']` type sound (non-optional, always present).
 */
export default function createExo(
  channel: Channel,
  exoInit?: { context?: ExoContext; uiMode?: UiMode; experience?: ExperienceSnapshot },
): ExoSDK {
  if (exoInit === undefined) {
    throw new Error('Context data is required')
  }

  const initialContext: ExoContext = exoInit.context ?? { type: 'experience', entityId: '' }
  const contextSignal = new MemoizedSignal<[ExoContext]>(initialContext)

  channel.addHandler('exo.contextChanged', (payload: ExoContext) => {
    contextSignal.dispatch(payload)
  })

  const initialMode: UiMode = exoInit.uiMode ?? 'form'
  const uiModeSignal = new MemoizedSignal<[UiMode]>(initialMode)

  channel.addHandler('exo.uiModeChanged', (payload: { mode: UiMode }) => {
    uiModeSignal.dispatch(payload.mode)
  })

  const experience = createExperienceAPI(channel, exoInit.experience)

  return {
    get context(): ExoContext {
      return contextSignal.getMemoizedArgs()[0]
    },
    onContextChanged(cb: (context: ExoContext) => void): Unsubscribe {
      return contextSignal.attach(cb)
    },
    getUiMode(): UiMode {
      return uiModeSignal.getMemoizedArgs()[0]
    },
    onUiModeChanged(cb: (mode: UiMode) => void): Unsubscribe {
      return uiModeSignal.attach(cb)
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
  const nodeApis = new Map<string, ExoNodeAPI>()

  return {
    get(): ExperienceSnapshot {
      return experienceSignal.getMemoizedArgs()[0]
    },
    onChange(cb: (v: ExperienceSnapshot) => void): Unsubscribe {
      return experienceSignal.attach(cb)
    },
    save(): Promise<void> {
      return channel.call('exo.saveExperience')
    },
    publish(): Promise<void> {
      return channel.call('exo.publishExperience')
    },
    getNode(nodeId: string): ExoNodeAPI | null {
      let nodeApi = nodeApis.get(nodeId)
      if (nodeApi === undefined) {
        nodeApi = createNodeAPI(channel, nodeId)
        nodeApis.set(nodeId, nodeApi)
      }
      return nodeApi
    },
    getRootNodes(): ExoNodeAPI[] {
      // This direct-channel factory has no local node tree, and the signature is
      // synchronous — it can't await a `channel.call`. Real root-node access is
      // served by the host-side bridge (`createExperienceApiFromBridge`), which
      // holds the tree in memory. Wiring this path needs a host->guest snapshot
      // push (a contract change) — tracked under EXT-7477 pending Thomas's review.
      return []
    },
    selection,
    dataAssembly,
  }
}

function createNodeAPI(
  channel: Channel,
  nodeId: string,
  nodeType: ExoNodeType = 'Component',
): ExoNodeAPI {
  const nodeSignal = new MemoizedSignal<[ExoNodeSnapshot]>({ id: nodeId, nodeType })

  channel.addHandler(`exo.nodeChanged.${nodeId}`, (payload: ExoNodeSnapshot) => {
    nodeSignal.dispatch(payload)
  })

  return {
    id: nodeId,
    nodeType,
    get(): ExoNodeSnapshot {
      return nodeSignal.getMemoizedArgs()[0]
    },
    onChange(cb: (node: ExoNodeSnapshot) => void): Unsubscribe {
      return nodeSignal.attach(cb)
    },
    getContentProperty<T = unknown>(key: string): Promise<T> {
      return channel.call<T>('exo.getNodeContentProperty', nodeId, key)
    },
    setContentProperty<T = unknown>(key: string, value: T): Promise<void> {
      return channel.call<void>('exo.setNodeContentProperty', nodeId, key, value)
    },
    onContentPropertyChanged<T = unknown>(key: string, cb: (value: T) => void): Unsubscribe {
      return channel.addHandler(`exo.nodeContentPropertyChanged.${nodeId}.${key}`, cb)
    },
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
    updateProperty<T = unknown>(key: string, value: T): Promise<void> {
      return channel.call<void>('exo.updateNodeProperty', nodeId, key, value)
    },
    getBinding(key: string): Promise<Binding | null> {
      return channel.call<Binding | null>('exo.getNodeBinding', nodeId, key)
    },
    setBinding(key: string, binding: Binding): Promise<void> {
      return channel.call<void>('exo.setNodeBinding', nodeId, key, binding)
    },
    resolveEntryBinding(key: string): Promise<{ entryId: string; fieldId?: string } | null> {
      return channel.call<{ entryId: string; fieldId?: string } | null>(
        'exo.resolveNodeEntryBinding',
        nodeId,
        key,
      )
    },
    getSlotDescriptor(): Promise<SlotDescriptor | null> {
      return channel.call<SlotDescriptor | null>('exo.getNodeSlotDescriptor', nodeId)
    },
  }
}

function createSelectionAPI(channel: Channel): ExoSelectionAPI {
  const selectionSignal = new MemoizedSignal<[{ nodeId: string | null; nodeType?: ExoNodeType }]>({
    nodeId: null,
  })

  channel.addHandler(
    'exo.selectionChanged',
    (payload: { nodeId: string | null; nodeType?: ExoNodeType }) => {
      selectionSignal.dispatch(payload)
    },
  )

  return {
    get(): { nodeId: string | null; nodeType?: ExoNodeType } {
      return selectionSignal.getMemoizedArgs()[0]
    },
    onChange(cb: (sel: { nodeId: string | null; nodeType?: ExoNodeType }) => void): Unsubscribe {
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
    getParameters(): Promise<Record<string, DataAssemblyParameter>> {
      return channel.call('exo.getDataAssemblyParameters')
    },
    getParameter(parameterId: string): Promise<DataAssemblyParameter | null> {
      return channel.call('exo.getDataAssemblyParameter', parameterId)
    },
    getEntryBindings(): Promise<EntryBindingRef[]> {
      return channel.call('exo.getDataAssemblyEntryBindings')
    },
    setParameter(parameterId: string, value: DataAssemblyParameterValue): Promise<void> {
      return channel.call('exo.setDataAssemblyParameter', parameterId, value)
    },
    setParameters(updates: Partial<Record<string, DataAssemblyParameterValue>>): Promise<void> {
      return channel.call('exo.setDataAssemblyParameters', updates)
    },
    onChange(cb: (snapshot: DataAssemblySnapshot) => void): Unsubscribe {
      return dataAssemblySignal.attach(cb)
    },
  }
}
