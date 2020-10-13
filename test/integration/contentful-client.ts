import * as contentful from 'contentful-management'

if (!process.env.CONTENTFUL_CMA_TOKEN) {
  require('dotenv').config()
}

export const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_CMA_TOKEN as string
})

export const getCurrentSpace = () => client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)
