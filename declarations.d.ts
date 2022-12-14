import { InAppPlainClientAPI } from './lib/types'

declare module 'contentful-management' {
  export function createClient(parameters: any): InAppPlainClientAPI
}
