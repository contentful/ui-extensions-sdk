const contentful = require('contentful-management')
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_CMA_TOKEN
})

module.exports = {
  getCurrentSpace: () => {
    return client.getSpace(process.env.CONTENTFUL_SPACE)
  },
  getCurrentEnvironment: async () => {
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE)
    return space.getEnvironment(process.env.CONTENTFUL_ENVIRONMENT)
  },
  client
}
