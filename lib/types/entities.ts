export type {
  TagProps as Tag,
  TagVisibility,
  UserProps as User,
  AssetProps as Asset,
  TaskProps as Task,
  ScheduledActionProps as ScheduledAction,
  ContentTypeProps as ContentType,
  EditorInterfaceProps as EditorInterface,
  SpaceMembershipProps as SpaceMembership,
  ContentFields as ContentTypeField,
  ContentTypeFieldValidation,
  EntryProps as Entry,
  RoleProps as Role,
  KeyValueMap,
} from 'contentful-management/types'

export interface CanonicalRequest {
  method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string
  headers?: Record<string, string>
  body?: string
}
