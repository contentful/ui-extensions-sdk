import * as contentful from 'contentful-management'
import { config } from 'dotenv'

if (!process.env.CONTENTFUL_CMA_TOKEN) {
  config()
}

export const client = contentful.createClient({
  accessToken: process.env.CONTENTFUL_CMA_TOKEN
})

export const getCurrentSpace = () => client.getSpace(process.env.CONTENTFUL_SPACE_ID)
