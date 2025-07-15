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

// // Release entity type definition
// export interface Release {
//   sys: {
//     type: 'Release'
//     id: string
//     version: number
//     space: { sys: { type: 'Link'; linkType: 'Space'; id: string } }
//     environment: { sys: { type: 'Link'; linkType: 'Environment'; id: string } }
//     createdAt: string
//     updatedAt: string
//     createdBy: { sys: { type: 'Link'; linkType: 'User'; id: string } }
//     updatedBy: { sys: { type: 'Link'; linkType: 'User'; id: string } }
//   }
//   name: string
//   description?: string
//   entities: {
//     sys: {
//       type: 'Array'
//     }
//     items: Array<{
//       sys: {
//         type: 'Link'
//         linkType: 'Entry' | 'Asset'
//         id: string
//       }
//     }>
//   }
// }
