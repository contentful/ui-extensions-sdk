const spaceMethods = [
  'getContentType',
  'getContentTypes',
  'createContentType',
  'updateContentType',
  'deleteContentType',

  'getEntries'
]

export default function createSpace (channel) {
  var space = {}

  spaceMethods.forEach((methodName) => {
    space[methodName] = function (...args) {
      return channel.call('callSpaceMethod', methodName, args)
    }
  })

  return space
}

