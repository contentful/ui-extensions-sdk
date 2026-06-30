import * as contentfulManagement from 'contentful-management'
import { createAdapter } from './cmaAdapter'
import { CMAClient } from './types/cmaClient.types'
import type { IdsAPI } from './types/api.types'
import type { Channel } from './channel'

// `contentful-management` is external, so its bundled shape depends on the
// consumer's bundler: some expose `createClient` directly, others wrap it under
// `default` (CJS↔ESM interop). Resolve both so a bare named import can't end up
// `undefined` and throw `createClient is not a function` inside `init()`.
type ContentfulManagementModule = typeof contentfulManagement & {
  default?: Partial<typeof contentfulManagement>
}

export function resolveCreateClient(
  mod: ContentfulManagementModule,
): typeof contentfulManagement.createClient {
  const createClient = mod.createClient ?? mod.default?.createClient

  if (typeof createClient !== 'function') {
    throw new TypeError(
      "Could not resolve `createClient` from 'contentful-management'. " +
        'This usually means an incompatible or duplicate version was bundled. ' +
        'Ensure a single contentful-management copy resolves in your app.',
    )
  }

  return createClient
}

export function createCMAClient(ids: IdsAPI, channel: Channel): CMAClient {
  return resolveCreateClient(contentfulManagement as ContentfulManagementModule)(
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
