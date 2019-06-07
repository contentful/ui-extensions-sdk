const contentful = require('contentful-management')
const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_CMA_TOKEN
})

module.exports = {
  getCurrentSpace: () => {
    return client.getSpace(process.env.CONTENTFUL_SPACE_ID)
  },
  client
}
