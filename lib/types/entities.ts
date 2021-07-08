export type {
  TagProps as Tag,
  TeamProps as Team,
  UserProps as User,
  AssetProps as Asset,
  TaskProps as Task,
  ScheduledActionProps as ScheduledAction,
  ContentTypeProps as ContentType,
  EditorInterfaceProps as EditorInterface,
  SpaceMembershipProps as SpaceMembership,
  TeamMembershipProps as TeamMembership,
  ContentFields as ContentTypeField,
  ContentTypeFieldValidation,
  EntryProps as Entry,
  RoleProps as Role,
  KeyValueMap,
  QueryOptions,
  TagVisibility,
} from 'contentful-management/types'

export interface CanonicalRequest {
  method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string
  headers?: Record<string, string>
  body?: string
}
