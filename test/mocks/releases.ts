function yesterday() {
  const now = new Date()
  const oneDayAgo = now.valueOf() - 60 * 60 * 24 * 1000
  return new Date(oneDayAgo).toISOString()
}

const today = new Date().toISOString()

export const mockRelease = {
  sys: {
    type: 'Release' as const,
    id: 'test-release-id',
    version: 1,
    space: { sys: { type: 'Link' as const, linkType: 'Space' as const, id: 'test-space' } },
    environment: { sys: { type: 'Link' as const, linkType: 'Environment' as const, id: 'master' } },
    createdAt: yesterday(),
    updatedAt: today,
    createdBy: { sys: { type: 'Link' as const, linkType: 'User' as const, id: 'user-1' } },
    updatedBy: { sys: { type: 'Link' as const, linkType: 'User' as const, id: 'user-1' } },
  },
  title: 'Test Release',
  description: 'A test release for validation',
  entities: {
    sys: { type: 'Array' as const },
    items: [
      {
        sys: {
          type: 'Link' as const,
          linkType: 'Entry' as const,
          id: 'entry-1',
        },
      },
      {
        sys: {
          type: 'Link' as const,
          linkType: 'Asset' as const,
          id: 'asset-1',
        },
      },
    ],
  },
} as any // Type assertion to work with ReleaseProps interface

export const mockReleaseWithoutEntities = {
  sys: {
    type: 'Release' as const,
    id: 'empty-release-id',
    version: 1,
    space: { sys: { type: 'Link' as const, linkType: 'Space' as const, id: 'test-space' } },
    environment: { sys: { type: 'Link' as const, linkType: 'Environment' as const, id: 'master' } },
    createdAt: yesterday(),
    updatedAt: today,
    createdBy: { sys: { type: 'Link' as const, linkType: 'User' as const, id: 'user-1' } },
    updatedBy: { sys: { type: 'Link' as const, linkType: 'User' as const, id: 'user-1' } },
  },
  title: 'Empty Release',
  description: 'A release with no entities',
  entities: {
    sys: { type: 'Array' as const },
    items: [],
  },
} as any

export default {
  total: 2,
  limit: 100,
  skip: 0,
  sys: {
    type: 'Array',
  },
  items: [mockRelease, mockReleaseWithoutEntities],
}
