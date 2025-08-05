import { sinon, expect } from '../helpers'

import createNavigator from '../../lib/navigator'
import { Channel } from '../../lib/channel'
import { IdsAPI } from '../../lib/types'

const SCENARIOS = [
  {
    method: 'openEntry',
    args: ['entry-id'],
    expected: { entityType: 'Entry', id: 'entry-id', entityInRelease: false, releaseId: undefined },
  },
  {
    method: 'openEntry',
    args: ['entry-id', { slideIn: true }],
    expected: {
      entityType: 'Entry',
      id: 'entry-id',
      slideIn: true,
      entityInRelease: false,
      releaseId: undefined,
    },
  },
  {
    method: 'openEntry',
    args: ['entry-id', { releaseId: 'release-123' }],
    expected: {
      entityType: 'Entry',
      id: 'entry-id',
      entityInRelease: false,
      releaseId: 'release-123',
    },
  },
  {
    method: 'openNewEntry',
    args: ['ct-id'],
    expected: { entityType: 'Entry', id: null, contentTypeId: 'ct-id' },
  },
  {
    method: 'openNewEntry',
    args: ['ct-id', { slideIn: true }],
    expected: {
      entityType: 'Entry',
      id: null,
      contentTypeId: 'ct-id',
      slideIn: true,
    },
  },
  {
    method: 'openAsset',
    args: ['asset-id'],
    expected: { entityType: 'Asset', id: 'asset-id', entityInRelease: false, releaseId: undefined },
  },
  {
    method: 'openAsset',
    args: ['asset-id', { slideIn: true }],
    expected: {
      entityType: 'Asset',
      id: 'asset-id',
      slideIn: true,
      entityInRelease: false,
      releaseId: undefined,
    },
  },
  {
    method: 'openAsset',
    args: ['asset-id', { releaseId: 'release-123' }],
    expected: {
      entityType: 'Asset',
      id: 'asset-id',
      entityInRelease: false,
      releaseId: 'release-123',
    },
  },
  {
    method: 'openNewAsset',
    args: [],
    expected: { entityType: 'Asset', id: null },
  },
  {
    method: 'openNewAsset',
    args: [{ slideIn: true }],
    expected: { entityType: 'Asset', id: null, slideIn: true },
  },
  {
    method: 'openPageExtension',
    args: [{ id: 'test-id', type: 'extension' }],
    expected: { id: 'test-id', type: 'extension' },
    channelMethod: 'navigateToPage',
  },
  {
    method: 'openPageExtension',
    args: [{ id: 'test-id', page: 'testPage', type: 'extension' }],
    expected: { id: 'test-id', page: 'testPage', type: 'extension' },
    channelMethod: 'navigateToPage',
  },
  {
    method: 'openPageExtension',
    args: [{ id: 'another-id', type: 'extension' }],
    expected: { id: 'another-id', type: 'extension' },
    channelMethod: 'navigateToPage',
  },
  {
    method: 'openPageExtension',
    args: [{ id: 'another-id', page: 'testPage', type: 'extension' }],
    expected: { id: 'another-id', page: 'testPage', type: 'extension' },
    channelMethod: 'navigateToPage',
  },
  {
    method: 'openCurrentAppPage',
    args: [{ id: 'app-id', page: '/something', type: 'app' }],
    expected: { id: 'app-id', page: '/something', type: 'app' },
    channelMethod: 'navigateToPage',
  },
  {
    method: 'openAppConfig',
    args: [],
    expected: undefined,
    channelMethod: 'navigateToAppConfig',
  },
  {
    method: 'openEntriesList',
    args: [],
    expected: { route: 'entries', releaseId: undefined },
    channelMethod: 'navigateToSpaceEnvRoute',
  },
  {
    method: 'openAssetsList',
    args: [],
    expected: { route: 'assets', releaseId: undefined },
    channelMethod: 'navigateToSpaceEnvRoute',
  },
]

describe('createNavigator()', () => {
  let channel: Channel
  let ids: IdsAPI

  beforeEach(() => {
    channel = {
      call: sinon.stub().returns(Promise.resolve()),
      addHandler: sinon.stub(),
    } as any
    ids = {
      space: 'space-id',
      environment: 'env-id',
      user: 'user-id',
      app: 'app-id',
      extension: 'extension-id',
      organization: 'org-id',
      field: 'field-id',
      entry: 'entry-id',
      contentType: 'content-type-id',
      release: 'release-id',
    }
  })

  describe('basic functionality', () => {
    it('should create navigator with channel and ids', () => {
      const navigator = createNavigator(channel, ids, undefined)
      expect(navigator).to.have.property('openEntry')
      expect(navigator).to.have.property('openNewEntry')
      expect(navigator).to.have.property('openAsset')
      expect(navigator).to.have.property('openNewAsset')
    })

    it('should call channel methods correctly', () => {
      const navigator = createNavigator(channel, ids, undefined)

      SCENARIOS.forEach(({ method, args, expected, channelMethod }) => {
        navigator[method](...args)

        const expectedMethod = channelMethod || 'navigateToContentEntity'
        if (expected === undefined) {
          expect(channel.call).to.have.been.calledWith(expectedMethod)
        } else {
          expect(channel.call).to.have.been.calledWith(expectedMethod, expected)
        }
      })
    })
  })

  describe('release functionality', () => {
    let mockRelease: any

    beforeEach(() => {
      mockRelease = {
        sys: {
          id: 'release-123',
          type: 'Release' as const,
          version: 1,
          status: 'active' as const,
          space: { sys: { type: 'Link' as const, linkType: 'Space' as const, id: 'space-id' } },
          environment: {
            sys: { type: 'Link' as const, linkType: 'Environment' as const, id: 'env-id' },
          },
          createdBy: { sys: { type: 'Link' as const, linkType: 'User' as const, id: 'user-id' } },
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedBy: { sys: { type: 'Link' as const, linkType: 'User' as const, id: 'user-id' } },
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        title: 'Test Release',
        entities: {
          sys: { type: 'Array' as const },
          items: [{ sys: { id: 'entry-in-release' } }, { sys: { id: 'another-entry' } }],
        },
      }
    })

    it('should set entityInRelease to true in openEntry when release is provided and entry is in release', () => {
      const navigator = createNavigator(channel, ids, mockRelease)

      // Test with entry that is in release
      navigator.openEntry('entry-in-release')
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-in-release',
        entityInRelease: true,
        releaseId: undefined,
      })
    })

    it('should set entityInRelease to false in openEntry when release is undefined', () => {
      const navigator = createNavigator(channel, ids, undefined)

      navigator.openEntry('any-entry')
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'any-entry',
        entityInRelease: false,
        releaseId: undefined,
      })
    })

    it('should pass through releaseId from options', () => {
      const navigator = createNavigator(channel, ids, mockRelease)

      navigator.openEntry('entry-in-release', { releaseId: 'custom-release-id' })
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-in-release',
        entityInRelease: true,
        releaseId: 'custom-release-id',
      })
    })

    it('should handle release with empty entities', () => {
      const emptyRelease = {
        sys: {
          id: 'release-123',
          type: 'Release' as const,
          version: 1,
          status: 'active' as const,
          space: { sys: { type: 'Link' as const, linkType: 'Space' as const, id: 'space-id' } },
          environment: {
            sys: { type: 'Link' as const, linkType: 'Environment' as const, id: 'env-id' },
          },
          createdBy: { sys: { type: 'Link' as const, linkType: 'User' as const, id: 'user-id' } },
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedBy: { sys: { type: 'Link' as const, linkType: 'User' as const, id: 'user-id' } },
          updatedAt: '2023-01-01T00:00:00.000Z',
        },
        title: 'Empty Release',
        entities: {
          sys: { type: 'Array' as const },
          items: [],
        },
      }
      const navigator = createNavigator(channel, ids, emptyRelease)

      navigator.openEntry('any-entry')
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'any-entry',
        entityInRelease: false,
        releaseId: undefined,
      })
    })

    it('should set entityInRelease to false in openAsset when release is provided but asset is not in release', () => {
      const navigator = createNavigator(channel, ids, mockRelease)

      // Test with asset that is in release
      navigator.openAsset('asset-in-release')
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Asset',
        id: 'asset-in-release',
        entityInRelease: false, // Assuming asset is not in release for this test
        releaseId: undefined,
      })
    })

    it('should set entityInRelease to false in openAsset when release is not provided', () => {
      const navigator = createNavigator(channel, ids, undefined)

      navigator.openAsset('any-asset')
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Asset',
        id: 'any-asset',
        entityInRelease: false,
        releaseId: undefined,
      })
    })

    it('should pass through releaseId from options in openAsset', () => {
      const navigator = createNavigator(channel, ids, mockRelease)

      navigator.openAsset('asset-id', { releaseId: 'custom-release-id' })
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Asset',
        id: 'asset-id',
        entityInRelease: false,
        releaseId: 'custom-release-id',
      })
    })

    it('should include releaseId in openEntriesList when release is provided', () => {
      const navigator = createNavigator(channel, ids, mockRelease)

      navigator.openEntriesList()
      expect(channel.call).to.have.been.calledWith('navigateToSpaceEnvRoute', {
        route: 'entries',
        releaseId: 'release-123',
      })
    })

    it('should not include releaseId in openEntriesList when release is undefined', () => {
      const navigator = createNavigator(channel, ids, undefined)

      navigator.openEntriesList()
      expect(channel.call).to.have.been.calledWith('navigateToSpaceEnvRoute', {
        route: 'entries',
        releaseId: undefined,
      })
    })

    it('should include releaseId in openAssetsList when release is provided', () => {
      const navigator = createNavigator(channel, ids, mockRelease)

      navigator.openAssetsList()
      expect(channel.call).to.have.been.calledWith('navigateToSpaceEnvRoute', {
        route: 'assets',
        releaseId: 'release-123',
      })
    })

    it('should not include releaseId in openAssetsList when release is undefined', () => {
      const navigator = createNavigator(channel, ids, undefined)

      navigator.openAssetsList()
      expect(channel.call).to.have.been.calledWith('navigateToSpaceEnvRoute', {
        route: 'assets',
        releaseId: undefined,
      })
    })
  })

  describe('signal handling', () => {
    it('should attach slide in signal handler', () => {
      const navigator = createNavigator(channel, ids, undefined)
      const handler = sinon.stub()

      navigator.onSlideInNavigation(handler)

      expect(channel.addHandler).to.have.been.calledWith('navigateSlideIn', sinon.match.func)
    })
  })

  describe('error handling', () => {
    it('should handle channel call errors', async () => {
      const error = new Error('Channel error')
      channel.call = sinon.stub().rejects(error)

      const navigator = createNavigator(channel, ids, undefined)

      try {
        await navigator.openEntry('entry-id')
        expect.fail('Should have thrown an error')
      } catch (err) {
        expect(err).to.equal(error)
      }
    })
  })
})
