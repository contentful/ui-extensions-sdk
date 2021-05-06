import { Channel } from './channel'
import { MemoizedSignal } from './signal'
import type { EntryAPI, EntryFieldInfo, TaskAPI } from './types/index'

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
  const entryMetadata = entryData.metadata

  channel.addHandler('sysChanged', (_sys: any) => {
    sys = _sys
    sysChanged.dispatch(sys)
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
    onSysChanged(handler: Function) {
      return sysChanged.attach(handler)
    },
    fields: fieldInfo.reduce((acc: any, info: EntryFieldInfo) => {
      acc[info.id] = createEntryField(info)
      return acc
    }, {}),
    ...(entryMetadata ? { metadata: entryMetadata } : {}),
    ...taskApi,
  }
}
