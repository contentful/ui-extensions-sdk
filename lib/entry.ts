import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import { EntryAPI, EntryFieldInfo, Metadata, TaskAPI } from './types'

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
  createEntryField: Function
): EntryAPI {
  let sys = entryData.sys
  const sysChanged = new MemoizedSignal(sys)
  let metadata = entryData.metadata
  const metadataChanged = new MemoizedSignal(metadata)

  channel.addHandler('sysChanged', (_sys: any) => {
    sys = _sys
    sysChanged.dispatch(sys)
  })

  channel.addHandler('metadataChanged', (_metadata: Metadata) => {
    metadata = _metadata
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
    publish(options?: { skipValidation?: boolean }) {
      return channel.call<void>('callEntryMethod', 'publish', options)
    },
    unpublish() {
      return channel.call<void>('callEntryMethod', 'unpublish')
    },
    save() {
      return channel.call<void>('callEntryMethod', 'save')
    },
    onSysChanged(handler: Function) {
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
