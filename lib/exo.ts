import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import {
  ExoSDK,
  UiMode,
  Unsubscribe,
  ExperienceSnapshot,
  ExperienceAPI,
  ExoNodeAPI,
  ExoSelectionAPI,
  DataAssemblySDK,
  DataAssemblySnapshot,
  DataAssemblyParameter,
  DataAssemblyParameterValue,
  EntryBindingRef,
  ComponentPropertyDescriptor,
} from './types'

/**
 * Creates the ExO SDK namespace when handshake includes `exo`; otherwise returns undefined.
 * @see EXT-7182
 * @see EXT-7185
 */
export default function createExo(
  channel: Channel,
  exoInit?: { uiMode?: UiMode; experience?: ExperienceSnapshot },
): ExoSDK | undefined {
  if (exoInit === undefined) {
    return undefined
  }

  const initialMode: UiMode = exoInit.uiMode ?? 'form'
  const uiModeSignal = new MemoizedSignal<[UiMode]>(initialMode)

  channel.addHandler('exo.uiModeChanged', (payload: { mode: UiMode }) => {
    uiModeSignal.dispatch(payload.mode)
  })

  const experience = createExperienceAPI(channel, exoInit.experience)

  return {
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
    sys: { id: '', type: 'Experience', version: 0 },
  }
  const experienceSignal = new MemoizedSignal<[ExperienceSnapshot]>(initialSnapshot)

  channel.addHandler('exo.experienceChanged', (payload: ExperienceSnapshot) => {
    experienceSignal.dispatch(payload)
  })

  const selection = createSelectionAPI(channel)
  const dataAssembly = createDataAssemblyAPI(channel)

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
      return createNodeAPI(channel, nodeId)
    },
    selection,
    dataAssembly,
  }
}

function createNodeAPI(channel: Channel, nodeId: string): ExoNodeAPI {
  return {
    getContentProperty(key: string): Promise<ComponentPropertyDescriptor | null> {
      return channel.call('exo.getNodeContentProperty', nodeId, key)
    },
    setContentProperty(key: string, value: unknown): Promise<void> {
      return channel.call('exo.setNodeContentProperty', nodeId, key, value)
    },
    getDesignProperty(key: string): Promise<ComponentPropertyDescriptor | null> {
      return channel.call('exo.getNodeDesignProperty', nodeId, key)
    },
    setDesignProperty(key: string, value: unknown): Promise<void> {
      return channel.call('exo.setNodeDesignProperty', nodeId, key, value)
    },
  }
}

function createSelectionAPI(channel: Channel): ExoSelectionAPI {
  const selectionSignal = new MemoizedSignal<[{ nodeId: string } | null]>(null)

  channel.addHandler('exo.selectionChanged', (payload: { nodeId: string } | null) => {
    selectionSignal.dispatch(payload)
  })

  return {
    get(): { nodeId: string } | null {
      return selectionSignal.getMemoizedArgs()[0]
    },
    onChange(cb: (selection: { nodeId: string } | null) => void): Unsubscribe {
      return selectionSignal.attach(cb)
    },
    set(nodeId: string): void {
      channel.send('exo.setSelection', { nodeId })
    },
    highlight(nodeId: string): void {
      channel.send('exo.highlightNode', { nodeId })
    },
  }
}

function createDataAssemblyAPI(channel: Channel): DataAssemblySDK {
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
