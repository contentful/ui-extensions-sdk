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
    expected: { entityType: 'Entry', id: null, contentTypeId: 'ct-id', slideIn: true },
  },
  {
    method: 'openAsset',
    args: ['asset-id'],
    expected: { entityType: 'Asset', id: 'asset-id' },
  },
  {
    method: 'openAsset',
    args: ['asset-id', { slideIn: true }],
    expected: { entityType: 'Asset', id: 'asset-id', slideIn: true },
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
    args: [{ route: 'entries' }],
    expected: undefined,
    channelMethod: 'navigateToSpaceEnvRoute',
  },
  {
    method: 'openAssetsList',
    args: [{ route: 'assets' }],
    expected: undefined,
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
        sys: { id: 'release-123' },
        title: 'Test Release',
        entities: {
          items: [{ sys: { id: 'entry-in-release' } }, { sys: { id: 'another-entry' } }],
        },
      }
    })

    it('should include entityInRelease when release is provided', () => {
      const navigator = createNavigator(channel, ids, mockRelease)

      // Test with entry that is in release
      navigator.openEntry('entry-in-release')
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-in-release',
        entityInRelease: true,
        releaseId: undefined,
      })

      // Test with entry that is not in release
      navigator.openEntry('entry-not-in-release')
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-not-in-release',
        entityInRelease: false,
        releaseId: undefined,
      })
    })

    it('should not include entityInRelease when release is undefined', () => {
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
        sys: { id: 'release-123' },
        title: 'Empty Release',
        entities: { items: [] },
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

    it('should handle release with undefined entities', () => {
      const undefinedRelease = {
        sys: { id: 'release-123' },
        title: 'Undefined Release',
        entities: undefined,
      }
      const navigator = createNavigator(channel, ids, undefinedRelease)

      navigator.openEntry('any-entry')
      expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'any-entry',
        entityInRelease: false,
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
