import { ContentEntitySys, ContentEntityType, Item, Link, Metadata } from './utils'

export type TagVisibility = 'private' | 'public'

export interface User {
  /**
   * System metadata
   */
  sys: {
    type: string
    id: string
    version: number
    createdBy?: Link
    createdAt: string
    updatedBy?: Link
    updatedAt: string
  }
  /**
   * First name of the user
   */
  firstName: string
  /**
   * Last name of the user
   */
  lastName: string
  /**
   * Url to the users avatar
   */
  avatarUrl: string
  /**
   * Email address of the user
   */
  email: string
  /**
   * Activation flag
   */
  activated: boolean
  /**
   * Number of sign ins
   */
  signInCount: number
  /**
   * User confirmation flag
   */
  confirmed: boolean
  '2faEnabled': boolean
  cookieConsentData: string
}

export interface Tag {
  sys: {
    type: 'Tag'
    id: string
    space: Link
    environment: Link
    createdBy?: Link
    updatedBy?: Link
    createdAt: string
    updatedAt: string
    version: number
    visibility: TagVisibility
  }
  name: string
}

export interface Asset {
  sys: ContentEntitySys
  fields: {
    /** Title for this asset */
    title: {
      [key: string]: string
    }
    /** Description for this asset */
    description?: {
      [key: string]: string
    }
    /** File object for this asset */
    file: {
      [key: string]: {
        fileName: string
        contentType: string
        /** Url where the file is available to be downloaded from, into the Contentful asset system. After the asset is processed this field is gone. */
        upload?: string
        /** Url where the file is available at the Contentful media asset system. This field won't be available until the asset is processed. */
        url?: string
        /** Details for the file, depending on file type (example: image size in bytes, etc) */
        details?: Record<string, any>
        uploadFrom?: Record<string, any>
      }
    }
  }
  metadata?: Metadata
}

type TaskStatus = 'active' | 'resolved'

interface TaskSys {
  id: string
  type: 'Task'
  parentEntity: { sys: Link }
  space: Link
  environment: Link
  createdBy: Link
  createdAt: string
  updatedBy: Link
  updatedAt: string
  version: number
}

export interface Task {
  assignedTo: Link
  body: string
  status: TaskStatus
  sys: TaskSys
}

export enum ScheduledActionStatuses {
  scheduled = 'scheduled',
  inProgress = 'inProgress',
  succeeded = 'succeeded',
  failed = 'failed',
  canceled = 'canceled',
}
// WARNING: This is using 'keyof' which looks at the left hand name, not the right hand value
type PublicActionStatus = keyof typeof ScheduledActionStatuses
type ScheduledActionActionType = 'publish' | 'unpublish'

export interface ScheduledAction {
  sys: {
    id: string
    type: 'ScheduledAction'
    /** ISO 8601 string */
    createdAt: string
    createdBy: Link
    /** ISO 8601 string */
    canceledAt?: string
    canceledBy?: Link
    space: Link
    status: PublicActionStatus
  }
  entity: {
    sys: {
      id: string
      linkType: ContentEntityType
      type: string
    }
  }
  environment?: Link
  scheduledFor: {
    /** ISO 8601 string */
    datetime: string
  }
  action: ScheduledActionActionType
}

export interface ContentTypeField extends Item {
  id: string
  name: string
  required: boolean
  localized: boolean
  disabled?: boolean
  omitted?: boolean
  deleted?: boolean
  items?: Item
  apiName?: string
}

export interface ContentType {
  sys: {
    type: string
    id: string
    version: number
    createdBy?: Link
    createdAt: string
    updatedBy?: Link
    updatedAt: string
    space: Link
    environment: Link
    firstPublishedAt?: string
    publishedCounter?: number
    publishedVersion?: number
  }
  fields: ContentTypeField[]
  name: string
  displayField: string
  description: string
}

interface EditorWidget {
  widgetId: string
  widgetNamespace: string
  settings?: Object
}

export interface EditorInterface {
  sys: Object
  controls?: Array<{
    fieldId: string
    widgetId?: string
    widgetNamespace?: string
    settings?: Object
  }>
  sidebar?: Array<{
    widgetId: string
    widgetNamespace: string
    settings?: Object
    disabled?: boolean
  }>
  editor?: EditorWidget
  editors?: EditorWidget[]
}

export interface SpaceMembership {
  sys: {
    id: string
    type: string
  }
  admin: boolean
  roles: { name: string; description: string }[]
}

export interface CanonicalRequest {
  method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string
  headers?: Record<string, string>
  body?: string
}
