const { MemoizedSignal } = require('./signal')

module.exports = function createEntry (channel, entryData, fieldInfo, createEntryField) {
  let sys = entryData.sys
  const sysChanged = new MemoizedSignal(sys)

  channel.addHandler('sysChanged', (_sys) => {
    sys = _sys
    sysChanged.dispatch(sys)
  })

  return {
    getSys () {
      return sys
    },
    onSysChanged (handler) {
      return sysChanged.attach(handler)
    },
    fields: fieldInfo.reduce((acc, info) => {
      acc[info.id] = createEntryField(info)
      return acc
    }, {})
  }
}
