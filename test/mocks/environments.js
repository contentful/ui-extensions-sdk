function yesterday() {
  const now = new Date()
  const defaultDate = now - 1000 * 60 * 60 * 48 * 1
  return new Date(defaultDate).toISOString()
}

const today = new Date().toISOString()

module.exports = {
  total: 36,
  limit: 100,
  skip: 0,
  sys: {
    type: 'Array'
  },
  items: [
    {
      name: 'master',
      sys: {
        type: 'Environment',
        id: 'master',
        version: 1,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'voxk9gcy69ri'
          }
        },
        status: {
          sys: {
            type: 'Link',
            linkType: 'Status',
            id: 'ready'
          }
        },
        createdBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        createdAt: '2019-05-29T12:06:19Z',
        updatedBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        updatedAt: '2019-05-29T12:06:19Z'
      }
    },
    {
      name: 'alex_testing',
      sys: {
        type: 'Environment',
        id: 'alex_testing',
        version: 6,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'voxk9gcy69ri'
          }
        },
        status: {
          sys: {
            type: 'Link',
            linkType: 'Status',
            id: 'ready'
          }
        },
        createdBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        createdAt: '2020-01-07T09:39:09Z',
        updatedBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        updatedAt: '2020-01-07T09:39:10Z'
      }
    },
    {
      name: 'kado-test',
      sys: {
        type: 'Environment',
        id: 'kado-test',
        version: 4,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'voxk9gcy69ri'
          }
        },
        status: {
          sys: {
            type: 'Link',
            linkType: 'Status',
            id: 'ready'
          }
        },
        createdBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        createdAt: '2020-02-26T15:32:39Z',
        updatedBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        updatedAt: '2020-02-26T15:32:40Z'
      }
    },
    {
      name: 'Ndc5NB21mUxHVNdz5KvDO',
      sys: {
        type: 'Environment',
        id: 'Ndc5NB21mUxHVNdz5KvDO',
        version: 4,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'voxk9gcy69ri'
          }
        },
        status: {
          sys: {
            type: 'Link',
            linkType: 'Status',
            id: 'ready'
          }
        },
        createdBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        createdAt: yesterday(),
        updatedBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        updatedAt: '2020-03-19T14:07:09Z'
      }
    },
    {
      name: 'Xhv3tSnea2tbKLAGha0a4',
      sys: {
        type: 'Environment',
        id: 'Xhv3tSnea2tbKLAGha0a4',
        version: 4,
        space: {
          sys: {
            type: 'Link',
            linkType: 'Space',
            id: 'voxk9gcy69ri'
          }
        },
        status: {
          sys: {
            type: 'Link',
            linkType: 'Status',
            id: 'ready'
          }
        },
        createdBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        createdAt: today,
        updatedBy: {
          sys: {
            type: 'Link',
            linkType: 'User',
            id: '60txzLuZBFZht0aZu6C2jF'
          }
        },
        updatedAt: '2020-03-19T14:12:51Z'
      }
    }
  ]
}
