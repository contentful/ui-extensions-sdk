import { describeChannelCallingMethod, sinon, expect } from '../helpers'

import createNavigator from '../../lib/navigator'
import { Channel } from '../../lib/channel'
import { IdsAPI } from '../../lib/types'
import { mockRelease, mockReleaseWithoutEntities } from '../mocks/releases'

const SCENARIOS = [
  {
    method: 'openEntry',
    args: ['entry-id'],
    expected: { entityType: 'Entry', id: 'entry-id', entryInRelease: false },
  },
  {
    method: 'openEntry',
    args: ['entry-id', { slideIn: true }],
    expected: { entityType: 'Entry', id: 'entry-id', slideIn: true, entryInRelease: false },
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
  describe('returned "navigator" object', () => {
    SCENARIOS.forEach(({ method, args, expected, channelMethod = 'navigateToContentEntity' }) => {
      describeChannelCallingMethod({
        creator: (channelStub: Channel) =>
          createNavigator(channelStub, 'test-id' as unknown as IdsAPI),
        methodName: method,
        channelMethod,
        args,
        expectedCallArgs: expected,
      })
    })
  })

  describe('release-aware navigation', () => {
    let channelStub: any
    let navigator: any

    beforeEach(() => {
      channelStub = {
        call: sinon.stub(),
        addHandler: sinon.spy(),
      }
    })

    describe('when release is provided', () => {
      beforeEach(() => {
        navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI, mockRelease)
      })

      it('should set entryInRelease to true when entry is in release', () => {
        navigator.openEntry('entry-1')

        expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'entry-1',
          entryInRelease: true,
        })
      })

      it('should set entryInRelease to false when entry is not in release', () => {
        navigator.openEntry('entry-not-in-release')

        expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'entry-not-in-release',
          entryInRelease: false,
        })
      })

      it('should preserve existing options when setting entryInRelease', () => {
        navigator.openEntry('entry-1', { slideIn: true, customOption: 'value' })

        expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'entry-1',
          slideIn: true,
          customOption: 'value',
          entryInRelease: true,
        })
      })

      it('should not set entryInRelease for assets', () => {
        navigator.openAsset('asset-1')

        expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Asset',
          id: 'asset-1',
        })
      })

      it('should not set entryInRelease for new entries', () => {
        navigator.openNewEntry('ct-id')

        expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: null,
          contentTypeId: 'ct-id',
        })
      })
    })

    describe('when release is provided but has no entities', () => {
      beforeEach(() => {
        navigator = createNavigator(
          channelStub,
          'test-id' as unknown as IdsAPI,
          mockReleaseWithoutEntities,
        )
      })

      it('should set entryInRelease to false for any entry', () => {
        navigator.openEntry('any-entry-id')

        expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'any-entry-id',
          entryInRelease: false,
        })
      })
    })

    describe('when no release is provided', () => {
      beforeEach(() => {
        navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI)
      })

      it('should set entryInRelease to false for entries', () => {
        navigator.openEntry('entry-1')

        expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Entry',
          id: 'entry-1',
          entryInRelease: false,
        })
      })

      it('should not set entryInRelease for assets', () => {
        navigator.openAsset('asset-1')

        expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
          entityType: 'Asset',
          id: 'asset-1',
        })
      })
    })
  })

  describe('isEntryInRelease function', () => {
    let channelStub: any
    let navigator: any

    beforeEach(() => {
      channelStub = {
        call: sinon.stub(),
        addHandler: sinon.spy(),
      }
    })

    it('should correctly identify entries in release', () => {
      navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI, mockRelease)

      // Test with entry that exists in release
      navigator.openEntry('entry-1')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-1',
        entryInRelease: true,
      })
    })

    it('should correctly identify entries not in release', () => {
      navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI, mockRelease)

      // Test with entry that doesn't exist in release
      navigator.openEntry('non-existent-entry')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'non-existent-entry',
        entryInRelease: false,
      })
    })

    it('should handle case-sensitive entry IDs', () => {
      navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI, mockRelease)

      // Test with case variation
      navigator.openEntry('ENTRY-1')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'ENTRY-1',
        entryInRelease: false,
      })
    })
  })

  describe('release parameter handling', () => {
    let channelStub: any
    let navigator: any

    beforeEach(() => {
      channelStub = {
        call: sinon.stub(),
        addHandler: sinon.spy(),
      }
    })

    it('should work with undefined release', () => {
      navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI)

      navigator.openEntry('entry-1')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-1',
        entryInRelease: false,
      })
    })

    it('should work with null release', () => {
      navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI, null as any)

      navigator.openEntry('entry-1')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-1',
        entryInRelease: false,
      })
    })

    it('should work with empty release entities', () => {
      navigator = createNavigator(
        channelStub,
        'test-id' as unknown as IdsAPI,
        mockReleaseWithoutEntities,
      )

      navigator.openEntry('any-entry')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'any-entry',
        entryInRelease: false,
      })
    })
  })

  describe('method-specific behavior', () => {
    let channelStub: any
    let navigator: any

    beforeEach(() => {
      channelStub = {
        call: sinon.stub(),
        addHandler: sinon.spy(),
      }
      navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI, mockRelease)
    })

    it('should only set entryInRelease for openEntry method', () => {
      // openEntry should have entryInRelease
      navigator.openEntry('entry-1')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-1',
        entryInRelease: true,
      })

      // Reset stub
      channelStub.call.reset()

      // openNewEntry should not have entryInRelease
      navigator.openNewEntry('ct-id')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: null,
        contentTypeId: 'ct-id',
      })

      // Reset stub
      channelStub.call.reset()

      // openAsset should not have entryInRelease
      navigator.openAsset('asset-1')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Asset',
        id: 'asset-1',
      })

      // Reset stub
      channelStub.call.reset()

      // openNewAsset should not have entryInRelease
      navigator.openNewAsset()
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Asset',
        id: null,
      })
    })

    it('should preserve all existing options when adding entryInRelease', () => {
      const options = {
        slideIn: { waitForClose: true },
        customOption: 'test-value',
        anotherOption: 123,
      }

      navigator.openEntry('entry-1', options)

      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-1',
        slideIn: { waitForClose: true },
        customOption: 'test-value',
        anotherOption: 123,
        entryInRelease: true,
      })
    })
  })

  describe('edge cases', () => {
    let channelStub: any
    let navigator: any

    beforeEach(() => {
      channelStub = {
        call: sinon.stub(),
        addHandler: sinon.spy(),
      }
    })

    it('should handle malformed release data gracefully', () => {
      const malformedRelease = {
        ...mockRelease,
        entities: {
          sys: { type: 'Array' },
          items: [
            { sys: { type: 'Link', linkType: 'Entry', id: 'entry-1' } },
            { sys: { type: 'Link', linkType: 'Entry' } }, // Missing id
            { sys: { type: 'Link', linkType: 'Entry', id: null } }, // Null id
          ],
        },
      }

      navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI, malformedRelease)

      // Should still work with valid entry
      navigator.openEntry('entry-1')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-1',
        entryInRelease: true,
      })

      // Reset stub
      channelStub.call.reset()

      // Should handle invalid entries gracefully
      navigator.openEntry('valid-entry')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'valid-entry',
        entryInRelease: false,
      })
    })

    it('should handle release with non-entry entities', () => {
      const releaseWithAssets = {
        ...mockRelease,
        entities: {
          sys: { type: 'Array' },
          items: [
            { sys: { type: 'Link', linkType: 'Asset', id: 'asset-1' } },
            { sys: { type: 'Link', linkType: 'Entry', id: 'entry-1' } },
          ],
        },
      }

      navigator = createNavigator(channelStub, 'test-id' as unknown as IdsAPI, releaseWithAssets)

      // Entry should still be detected
      navigator.openEntry('entry-1')
      expect(channelStub.call).to.have.been.calledWith('navigateToContentEntity', {
        entityType: 'Entry',
        id: 'entry-1',
        entryInRelease: true,
      })
    })
  })
})
