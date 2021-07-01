import { describeChannelCallingMethod } from '../helpers'

import createNavigator from '../../lib/navigator'
import { Channel } from '../../lib/channel'
import { IdsAPI } from '../../lib/types'

const SCENARIOS = [
  {
    method: 'openEntry',
    args: ['entry-id'],
    expected: { entityType: 'Entry', id: 'entry-id' },
  },
  {
    method: 'openEntry',
    args: ['entry-id', { slideIn: true }],
    expected: { entityType: 'Entry', id: 'entry-id', slideIn: true },
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
          createNavigator(channelStub, ('test-id' as unknown) as IdsAPI),
        methodName: method,
        channelMethod,
        args,
        expectedCallArgs: expected,
      })
    })
  })
})
