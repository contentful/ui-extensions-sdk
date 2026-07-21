import { expect } from 'chai'
import { createCMAClient, resolveCreateClient } from '../../lib/cma'
import { IdsAPI } from '../../lib/types'

describe('createCMAClient()', function () {
  const ids: IdsAPI = {
    space: 'space',
    environment: 'environment',
    environmentAlias: 'environmentAlias',
    organization: 'organization',
    extension: 'extension',
    user: 'user',
    field: 'field',
    entry: 'entry',
    contentType: 'contentType',
  }

  it('Creates a CMA client', function () {
    const client = createCMAClient(ids, { addHandler: () => {} } as any)
    expect(client).to.be.an('object')
  })

  // Regression: `contentful-management` can be bundled with `createClient` either
  // as a direct namespace member or wrapped under `default` (CJS↔ESM interop).
  // Both must resolve, otherwise `init()` throws `createClient is not a function`.
  describe('resolveCreateClient() interop', function () {
    const fn = () => undefined

    it('resolves createClient as a direct namespace member', function () {
      expect(resolveCreateClient({ createClient: fn } as any)).to.equal(fn)
    })

    it('resolves createClient wrapped under default', function () {
      expect(resolveCreateClient({ default: { createClient: fn } } as any)).to.equal(fn)
    })

    it('prefers the direct namespace member over default', function () {
      const wrapped = () => undefined
      expect(
        resolveCreateClient({ createClient: fn, default: { createClient: wrapped } } as any),
      ).to.equal(fn)
    })

    it('throws a helpful error when createClient cannot be resolved', function () {
      expect(() => resolveCreateClient({} as any)).to.throw(
        TypeError,
        /Could not resolve `createClient`/,
      )
    })

    // A bundler can resolve `contentful-management` to a non-module (e.g. its
    // `.cjs` entry emitted as a static asset URL). The error names the resolved
    // type and points at bundler config.
    it('reports the resolved type for a non-module value', function () {
      expect(() => resolveCreateClient('/static/media/index.abc123.cjs' as any)).to.throw(
        TypeError,
        /resolved to a string.*\.cjs/s,
      )
    })
  })

  // Apps are space-env scoped per CMA Adapter Permissions
  // (https://contentful.atlassian.net/l/cp/g8WtTjUT). Org-scoped surfaces
  // (semanticSettings, contentSemanticsIndex.get/getMany) are intentionally
  // excluded.
  describe('Content Semantics surface', function () {
    const semanticGetEntities = [
      'semanticSearch',
      'semanticDuplicates',
      'semanticRecommendations',
      'semanticReferenceSuggestions',
    ] as const

    semanticGetEntities.forEach((entity) => {
      it(`exposes ${entity}.get`, function () {
        const client = createCMAClient(ids, { addHandler: () => {} } as any)
        expect(client[entity]).to.be.an('object')
        expect(client[entity].get).to.be.a('function')
      })
    })

    it('exposes contentSemanticsIndex.getManyForEnvironment (env-scoped only)', function () {
      const client = createCMAClient(ids, { addHandler: () => {} } as any)
      expect(client.contentSemanticsIndex).to.be.an('object')
      expect(client.contentSemanticsIndex.getManyForEnvironment).to.be.a('function')
    })
  })
})
