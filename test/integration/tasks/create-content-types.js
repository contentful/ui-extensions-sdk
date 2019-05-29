const getCurrentEnvironment = require('../contentful-client').getCurrentEnvironment

module.exports = async () => {
  const environment = await getCurrentEnvironment()

  const contentType = await environment.createContentTypeWithId('post', {
    name: 'Post',
    fields: [
      {
        id: 'title',
        name: 'Title',
        required: true,
        localized: false,
        type: 'Symbol'
      },
      {
        id: 'body',
        name: 'Body',
        required: false,
        localized: false,
        type: 'Text'
      }
    ]
  })

  console.log('Created new "post" content type!')

  return contentType
}
