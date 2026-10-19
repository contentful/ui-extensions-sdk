import { sinon, expect } from '../helpers'

import createNavigator from '../../lib/navigator'
import { Channel } from '../../lib/channel'
import { IdsAPI } from '../../lib/types'
import { mockRelease } from '../mocks/releases'

const SCENARIOS = [
  {
    method: 'openEntry',
    args: ['entry-id'],
    expected: { entityType: 'Entry', id: 'entry-id', releaseId: undefined },
  },
  {
    method: 'openEntry',
    args: ['entry-id', { slideIn: true }],
    expected: {
      entityType: 'Entry',
      id: 'entry-id',
      slideIn: true,
      releaseId: undefined,
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
    expected: { entityType: 'Asset', id: 'asset-id', releaseId: undefined },
  },
  {
    method: 'openAsset',
    args: ['asset-id', { slideIn: true }],
    expected: {
      entityType: 'Asset',
      id: 'asset-id',
      slideIn: true,
      releaseId: undefined,
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
  {
    method: 'openExperience',
    args: ['experience-id'],
    expected: { id: 'experience-id', releaseId: undefined },
    channelMethod: 'navigateToExperience',
  },
  {
    method: 'openComponent',
    args: ['component-id'],
    expected: { id: 'component-id' },
    channelMethod: 'navigateToComponent',
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
    describe('openEntry with release', () => {
      it('should pass releaseId when release exists', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openEntry('entry-id')
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'entry-id',
          releaseId: 'test-release-id',
        })
      })

      it('should pass releaseId as undefined when release is undefined', () => {
        const navigator = createNavigator(channel, ids, undefined)

        navigator.openEntry('entry-id')
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'entry-id',
          releaseId: undefined,
        })
      })

      it('should spread other options correctly', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openEntry('entry-id', { slideIn: true })
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'entry-id',
          slideIn: true,
          releaseId: 'test-release-id',
        })
      })

      it('should ignore releaseId from options', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openEntry('entry-id', { releaseId: 'ignored-release-id' })
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'entry-id',
          releaseId: 'test-release-id', // Uses release.sys.id, not the option
        })
      })
    })

    describe('openAsset with release', () => {
      it('should pass releaseId when release exists', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openAsset('asset-id')
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Asset',
          id: 'asset-id',
          releaseId: 'test-release-id',
        })
      })

      it('should pass releaseId as undefined when release is undefined', () => {
        const navigator = createNavigator(channel, ids, undefined)

        navigator.openAsset('asset-id')
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Asset',
          id: 'asset-id',
          releaseId: undefined,
        })
      })

      it('should spread other options correctly', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openAsset('asset-id', { slideIn: true })
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Asset',
          id: 'asset-id',
          slideIn: true,
          releaseId: 'test-release-id',
        })
      })

      it('should ignore releaseId from options', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openAsset('asset-id', { releaseId: 'ignored-release-id' })
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Asset',
          id: 'asset-id',
          releaseId: 'test-release-id', // Uses release.sys.id, not the option
        })
      })
    })

    describe('openEntriesList with release', () => {
      it('should pass releaseId when release exists', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openEntriesList()
        expect(channel.call).to.have.been.calledWith('navigateToSpaceEnvRoute', {
          route: 'entries',
          releaseId: 'test-release-id',
        })
      })

      it('should pass releaseId as undefined when release is undefined', () => {
        const navigator = createNavigator(channel, ids, undefined)

        navigator.openEntriesList()
        expect(channel.call).to.have.been.calledWith('navigateToSpaceEnvRoute', {
          route: 'entries',
          releaseId: undefined,
        })
      })
    })

    describe('openAssetsList with release', () => {
      it('should pass releaseId when release exists', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openAssetsList()
        expect(channel.call).to.have.been.calledWith('navigateToSpaceEnvRoute', {
          route: 'assets',
          releaseId: 'test-release-id',
        })
      })

      it('should pass releaseId as undefined when release is undefined', () => {
        const navigator = createNavigator(channel, ids, undefined)

        navigator.openAssetsList()
        expect(channel.call).to.have.been.calledWith('navigateToSpaceEnvRoute', {
          route: 'assets',
          releaseId: undefined,
        })
      })
    })

    describe('openExperience with release', () => {
      it('should pass releaseId when release exists', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openExperience('experience-id')
        expect(channel.call).to.have.been.calledWith('navigateToExperience', {
          id: 'experience-id',
          releaseId: 'test-release-id',
        })
      })

      it('should pass releaseId as undefined when release is undefined', () => {
        const navigator = createNavigator(channel, ids, undefined)

        navigator.openExperience('experience-id')
        expect(channel.call).to.have.been.calledWith('navigateToExperience', {
          id: 'experience-id',
          releaseId: undefined,
        })
      })
    })

    describe('methods that do not handle releaseId', () => {
      it('should not pass releaseId in openNewEntry', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openNewEntry('content-type-id')
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: null,
          contentTypeId: 'content-type-id',
        })
      })

      it('should not pass releaseId in openNewAsset', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openNewAsset()
        expect(channel.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Asset',
          id: null,
        })
      })

      it('should not pass releaseId in openBulkEditor', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openBulkEditor('entry-id', { fieldId: 'field-id', locale: 'en-US', index: 0 })
        expect(channel.call).to.have.been.calledWith('navigateToBulkEditor', {
          entryId: 'entry-id',
          fieldId: 'field-id',
          locale: 'en-US',
          index: 0,
        })
      })

      it('should not pass releaseId in openPageExtension', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openPageExtension({ id: 'extension-id' })
        expect(channel.call).to.have.been.calledWith('navigateToPage', {
          type: 'extension',
          id: 'extension-id',
        })
      })

      it('should not pass releaseId in openCurrentAppPage', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openCurrentAppPage({ path: '/some-path' })
        expect(channel.call).to.have.been.calledWith('navigateToPage', {
          type: 'app',
          id: 'app-id',
          path: '/some-path',
        })
      })

      it('should not pass releaseId in openAppConfig', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openAppConfig()
        expect(channel.call).to.have.been.calledWith('navigateToAppConfig')
      })

      it('should not pass releaseId in openComponent', () => {
        const navigator = createNavigator(channel, ids, mockRelease)

        navigator.openComponent('component-id')
        expect(channel.call).to.have.been.calledWith('navigateToComponent', {
          id: 'component-id',
        })
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

    it('should register a pageNavigated channel handler', () => {
      createNavigator(channel, ids, undefined, undefined)

      expect(channel.addHandler).to.have.been.calledWith('pageNavigated', sinon.match.func)
    })

    it('should dispatch the path to onPathChange handlers when the channel fires pageNavigated', () => {
      const navigator = createNavigator(channel, ids, undefined, { path: '/overview' })
      const handler = sinon.stub()

      navigator.onPathChange(handler)

      const dispatch = channel.addHandler.withArgs('pageNavigated').firstCall.args[1]
      dispatch('/audience/segments')

      expect(handler).to.have.been.calledWith({ path: '/audience/segments' })
    })

    it('should stop calling an onPathChange handler once it is detached', () => {
      const navigator = createNavigator(channel, ids, undefined, { path: '/overview' })
      const handler = sinon.stub()

      const detach = navigator.onPathChange(handler)
      detach()
      handler.resetHistory()

      const dispatch = channel.addHandler.withArgs('pageNavigated').firstCall.args[1]
      dispatch('/agent')

      sinon.assert.notCalled(handler)
    })

    it('should call an onPathChange handler on subscribe with the invocation path', () => {
      const navigator = createNavigator(channel, ids, undefined, { path: '/overview' })
      const handler = sinon.stub()

      navigator.onPathChange(handler)

      expect(handler).to.have.been.calledOnceWith({ path: '/overview' })
    })

    it('should fall back to the root path when no invocation path is given', () => {
      const navigator = createNavigator(channel, ids, undefined, undefined)
      const handler = sinon.stub()

      navigator.onPathChange(handler)

      expect(handler).to.have.been.calledOnceWith({ path: '/' })
    })

    it('should replay the last dispatched path to handlers subscribing afterwards', () => {
      const navigator = createNavigator(channel, ids, undefined, { path: '/overview' })

      const dispatch = channel.addHandler.withArgs('pageNavigated').firstCall.args[1]
      dispatch('/audience/segments')

      const handler = sinon.stub()
      navigator.onPathChange(handler)

      expect(handler).to.have.been.calledOnceWith({ path: '/audience/segments' })
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
