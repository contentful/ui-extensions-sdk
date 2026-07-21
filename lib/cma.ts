import * as contentfulManagement from 'contentful-management'
import { createAdapter } from './cmaAdapter'
import { CMAClient } from './types/cmaClient.types'
import type { IdsAPI } from './types/api.types'
import type { Channel } from './channel'

// `contentful-management` is an external dependency, so the runtime shape
// depends on the consumer's bundler: `createClient` may sit on the namespace
// directly or under `default` (interop wrapper). Resolve both.
type ContentfulManagementModule = typeof contentfulManagement & {
  default?: Partial<typeof contentfulManagement>
}

export function resolveCreateClient(
  mod: ContentfulManagementModule,
): typeof contentfulManagement.createClient {
  const createClient = mod.createClient ?? mod.default?.createClient

  if (typeof createClient !== 'function') {
    const received = mod === null || mod === undefined ? String(mod) : typeof mod
    throw new TypeError(
      `Could not resolve \`createClient\` from 'contentful-management' (resolved to a ${received}). ` +
        'Ensure your bundler bundles contentful-management as a module — some ' +
        'bundlers emit its `.cjs` entry as a static asset; excluding `.cjs` from ' +
        'asset/file loaders resolves this.',
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
