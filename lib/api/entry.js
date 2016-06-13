import { MemoizedSignal } from './signal'
import Field from './field'

export default
function createEntry (channel, entryData, fieldInfo, defaultLocale) {
  let sys = entryData.sys
  let sysChanged = new MemoizedSignal(sys)

  channel.addHandler('sysChanged', (_sys) => {
    sys = _sys
    sysChanged.dispatch(sys)
  })

  let entry = {
    fields: {},
    getSys () {
      return sys
    },
    onSysChanged (handler) {
      return sysChanged.attach(handler)
    }
  }

  fieldInfo.forEach((info) => {
    entry.fields[info.id] = new Field(channel, info, defaultLocale)
  })

  return entry
}
