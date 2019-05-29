const getCurrentEnvironment = require('../contentful-client').getCurrentEnvironment

module.exports = async () => {
  const environment = await getCurrentEnvironment()

  const contentType = await environment.getContentType('post')
  await contentType.delete()

  console.log('Deleted "post" content type!')

  return true
}
