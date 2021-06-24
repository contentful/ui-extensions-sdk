import { createClient } from 'contentful-management'

if (!process.env.CONTENTFUL_CMA_TOKEN) {
  require('dotenv').config()
}

console.log('CONTENTFUL_HOST', (process.env.CONTENTFUL_HOST || '').split('').reverse())

export const client = createClient({
  host: process.env.CONTENTFUL_HOST || 'api.contentful.com',
  accessToken: process.env.CONTENTFUL_CMA_TOKEN as string,
})

export const getCurrentSpace = () => client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)
