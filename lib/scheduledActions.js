module.exports = function createScheduledActions(channel) {
  return {
    getEntityScheduledActions: (entityType, entityId) => {
      return channel.call('callScheduleActions', {
        entityType,
        entityId,
        method: 'getEntityScheduledActions'
      })
    },
    getAllScheduledActions: () => {
      return channel.call('callScheduleActions', {
        method: 'getAllScheduledActions'
      })
    }
  }
}
