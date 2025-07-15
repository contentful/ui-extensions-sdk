export type {
  AssetProps as Asset,
  ContentFields as ContentTypeField,
  ContentTypeFieldValidation,
  ContentTypeProps as ContentType,
  EditorInterfaceProps as EditorInterface,
  EntryProps as Entry,
  KeyValueMap,
  MetadataProps as Metadata,
  QueryOptions,
  ReleaseProps as Release,
  RoleProps as Role,
  ScheduledActionProps as ScheduledAction,
  SpaceMembershipProps as SpaceMembership,
  TagProps as Tag,
  TagVisibility,
  TaskProps as Task,
  TeamProps as Team,
  UploadProps as Upload,
  UserProps as User,
  WorkflowDefinitionProps as WorkflowDefinition,
} from 'contentful-management/types'

export interface CanonicalRequest {
  method: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  path: string
  headers?: Record<string, string>
  body?: string
}
