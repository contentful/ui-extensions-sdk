import { createClient } from 'contentful-management'
import { createAdapter } from './cmaAdapter'
import { CMAClient } from './types/cmaClient.types'
import type { IdsAPI } from './types/api.types'
import type { Channel } from './channel'

export function createCMAClient(ids: IdsAPI, channel: Channel): CMAClient {
  return createClient(
    { apiAdapter: createAdapter(channel) },
    {
      type: 'plain',
      defaults: {
        environmentId: ids.environmentAlias ?? ids.environment,
        spaceId: ids.space,
        organizationId: ids.organization,
        releaseId: ids.release,
      },
    },
  )
}
