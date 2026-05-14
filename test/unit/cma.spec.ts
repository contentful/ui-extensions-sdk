import { expect } from 'chai'
import { createCMAClient } from '../../lib/cma'
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
