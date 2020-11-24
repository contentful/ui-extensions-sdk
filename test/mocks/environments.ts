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
      name: 'master',
      sys: {
        type: 'Environment',
        id: 'master',
        createdAt: '2019-05-29T12:06:19Z',
      },
    },
    {
      name: 'alex_testing',
      sys: {
        type: 'Environment',
        id: 'alex_testing',
        createdAt: '2020-01-07T09:39:09Z',
      },
    },
    {
      name: 'kado-test',
      sys: {
        type: 'Environment',
        id: 'kado-test',
        version: 4,
        createdAt: '2020-02-26T15:32:39Z',
      },
    },
    {
      name: 'Ndc5NB21mUxHVNdz5KvDO',
      sys: {
        type: 'Environment',
        id: 'Ndc5NB21mUxHVNdz5KvDO',
        createdAt: yesterday(),
      },
    },
    {
      name: 'Xhv3tSnea2tbKLAGha0a4',
      sys: {
        type: 'Environment',
        id: 'Xhv3tSnea2tbKLAGha0a4',
        createdAt: today,
      },
    },
  ],
}
