type SysWithId = {
  id: string
}

export type WithOptionalId<Type extends { sys: unknown }> = Omit<Type, 'sys'> & {
  sys?: Omit<Type['sys'], 'id'> & Partial<SysWithId>
}

export type WithId<Type extends { sys: unknown }> = Omit<Type, 'sys'> & {
  sys: Partial<Omit<Type['sys'], 'id'>> & SysWithId
}

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

export type Metadata = {
  tags: Link<'Tag', 'Link'>[]
}

export interface Items {
  type: string
  linkType?: string
  validations?: Object[]
}

export interface SearchQuery {
  order?: string
  skip?: number
  limit?: number

  [key: string]: any
}
