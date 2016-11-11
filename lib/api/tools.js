export default function createTools (channel) {
  return {
    openEntitySelector: function (options) {
      return channel.call('openEntitySelector', options)
    }
  }
}
