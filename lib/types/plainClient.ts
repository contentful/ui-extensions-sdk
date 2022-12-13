import { PlainClientAPI, AlphaWorkflowExtension } from 'contentful-management/types'

export type InAppPlainClientAPI = {
  appAction: Pick<PlainClientAPI['appAction'], 'get' | 'getMany' | 'getManyForEnvironment'>
  appDefinition: Pick<PlainClientAPI['appDefinition'], 'get' | 'getInstallationsForOrg'>
  appInstallation: Pick<PlainClientAPI['appInstallation'], 'getForOrganization'>
  asset: PlainClientAPI['asset']
  assetKey: PlainClientAPI['assetKey']
  appSignedRequest: Pick<PlainClientAPI['appSignedRequest'], 'create'>
  bulkAction: PlainClientAPI['bulkAction']
  comment: PlainClientAPI['comment']
  contentType: PlainClientAPI['contentType']
  editorInterface: PlainClientAPI['editorInterface']
  environment: Pick<PlainClientAPI['environment'], 'get'>
  environmentAlias: Pick<PlainClientAPI['environmentAlias'], 'get'>
  entry: PlainClientAPI['entry']
  locale: PlainClientAPI['locale']
  release: PlainClientAPI['release']
  releaseAction: PlainClientAPI['releaseAction']
  role: Pick<PlainClientAPI['role'], 'get' | 'getMany'>
  scheduledActions: PlainClientAPI['scheduledActions']
  snapshot: PlainClientAPI['snapshot']
  space: Pick<PlainClientAPI['space'], 'get'>
  upload: PlainClientAPI['upload']
  user: Pick<PlainClientAPI['user'], 'getManyForSpace' | 'getForSpace'>
  usage: Pick<PlainClientAPI['usage'], 'getManyForSpace'>
  team: Pick<PlainClientAPI['team'], 'getManyForSpace'>
  task: PlainClientAPI['task']
  tag: PlainClientAPI['tag']
  uiConfig: PlainClientAPI['uiConfig']
  userUIConfig: PlainClientAPI['userUIConfig']
}

export type AlphaInAppPlainClientAPI = InAppPlainClientAPI & AlphaWorkflowExtension
