import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { EntryAPI, EntryFieldInfo, EntrySys, Metadata, Release, TaskAPI } from './types'
import { ExhaustiveEntryFieldAPI } from './types/field.types'

const taskMethods: Array<keyof TaskAPI> = [
  'getTask',
  'getTasks',
  'createTask',
  'updateTask',
  'deleteTask',
]

export default function createEntry(
  channel: Channel,
  entryData: any,
  fieldInfo: EntryFieldInfo[],
  createEntryField: (info: EntryFieldInfo) => ExhaustiveEntryFieldAPI,
  release?: Release,
): EntryAPI {
  let sys = entryData.sys
  const sysChanged = new MemoizedSignal<[EntrySys]>(sys)
  let metadata = entryData.metadata
  const metadataChanged = new MemoizedSignal<[Metadata | undefined]>(metadata)

  channel.addHandler('sysChanged', (newSys: Metadata) => {
    sys = newSys
    sysChanged.dispatch(sys)
  })

  channel.addHandler('metadataChanged', (newMetadata: Metadata) => {
    metadata = newMetadata
    metadataChanged.dispatch(metadata)
  })

  const taskApi = {} as TaskAPI

  taskMethods.forEach((methodName) => {
    taskApi[methodName] = function (...args: any[]) {
      return channel.call('callEntryMethod', methodName, args)
    } as any
  })

  return {
    getSys() {
      return sys
    },
    publish(options?: { skipUiValidation?: boolean }) {
      if (release) {
        throw new Error('SDK method "publish" is not supported in release context')
      }
      return channel.call<void>('callEntryMethod', 'publish', [options])
    },
    unpublish() {
      if (release) {
        throw new Error('SDK method "unpublish" is not supported in release context')
      }
      return channel.call<void>('callEntryMethod', 'unpublish')
    },
    save() {
      return channel.call<void>('callEntryMethod', 'save')
    },
    onSysChanged(handler: (sys: EntrySys) => void) {
      return sysChanged.attach(handler)
    },
    fields: fieldInfo.reduce((acc: any, info: EntryFieldInfo) => {
      acc[info.id] = createEntryField(info)
      return acc
    }, {}),
    ...(metadata ? { metadata } : {}),
    getMetadata() {
      return metadata
    },
    onMetadataChanged(handler: VoidFunction) {
      return metadataChanged.attach(handler)
    },
    ...taskApi,
  }
}
