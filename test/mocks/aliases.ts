function yesterday() {
  const now = new Date()
  const oneDayAgo = now.valueOf() - 60 * 60 * 24 * 1000
  return new Date(oneDayAgo).toISOString()
}

const today = new Date().toISOString()

export default {
  total: 36,
  limit: 100,
  skip: 0,
  sys: {
    type: 'Array',
  },
  items: [
    {
      sys: {
        type: 'Environment Alias',
        id: 'new',
        createdAt: today,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'yadj1kx9rmg0',
          },
        },
        version: 1,
      },
      environment: {
        sys: {
          type: 'Link',
          linkType: 'Environment',
          id: 'release-1',
        },
      },
    },
    {
      sys: {
        type: 'Environment Alias',
        id: 'master',
        createdAt: yesterday(),
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'yadj1kx9rmg0',
          },
        },
        version: 1,
      },
      environment: {
        sys: {
          type: 'Link',
          linkType: 'Environment',
          id: 'release-1',
        },
      },
    },
    {
      sys: {
        type: 'Environment Alias',
        id: 'old',
        createdAt: yesterday(),
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'yadj1kx9rmg0',
          },
        },
        version: 1,
      },
      environment: {
        sys: {
          type: 'Link',
          linkType: 'Environment',
          id: 'release-1',
        },
      },
    },
  ],
}
