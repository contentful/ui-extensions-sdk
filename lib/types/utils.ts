import { ContentTypeFieldValidation } from './entities'

type Sys = {
  id: string
  type: string
  [key: string]: any
}

type Entity = {
  sys: Sys
  [key: string]: any
}

type Optional<Type, Keys extends keyof Type> = Partial<Type> & Omit<Type, Keys>

export type WithSysWithAtLeastId = { sys: { id: string; [key: string]: any } }
export type WithId<Type extends Entity> = Omit<Type, 'sys'> & WithSysWithAtLeastId
export type WithOptionalId<Type extends Entity> = Optional<Type, 'sys'> | WithId<Type>

export interface Link<LinkType = string, Type = string> {
  sys: {
    id: string
    type: Type
    linkType: LinkType
  }
}

export interface CollectionResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
  sys: { type: string }
}

export type ContentEntityType = 'Entry' | 'Asset' | string

export interface ContentEntitySys {
  space: Link
  id: string
  type: ContentEntityType
  createdAt: string
  updatedAt: string
  environment: Link
  publishedVersion?: number
  deletedVersion?: number
  archivedVersion?: number
  publishedAt?: string
  firstPublishedAt?: string
  createdBy?: Link
  updatedBy?: Link
  publishedCounter?: number
  version: number
  publishedBy?: Link
  contentType: Link
}

export interface Items {
  type: string
  linkType?: string
  validations?: ContentTypeFieldValidation[]
}

export interface SearchQuery {
  order?: string
  skip?: number
  limit?: number

  [key: string]: any
}

export type SerializedJSONValue =
  | null
  | string
  | number
  | boolean
  | Array<SerializedJSONValue>
  | { [key: string]: SerializedJSONValue }
