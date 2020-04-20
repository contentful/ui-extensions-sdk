export default [
  {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: 'voxk9gcy69ri' } },
      id: 'imageWrapper',
      type: 'ContentType',
      createdAt: '2019-07-15T09:20:58.348Z',
      updatedAt: '2019-07-15T09:20:58.348Z',
      environment: {
        sys: { id: Cypress.env('activeEnvironmentId'), type: 'Link', linkType: 'Environment' }
      },
      revision: 1
    },
    name: 'ImageWrapper',
    description: '',
    displayField: 'title',
    fields: [
      {
        id: 'title',
        name: 'title',
        type: 'Symbol',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: 'tags',
        name: 'tags',
        type: 'Array',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
        items: { type: 'Symbol', validations: [] }
      },
      {
        id: 'image',
        name: 'image',
        type: 'Link',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false,
        linkType: 'Asset'
      }
    ]
  },
  {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: 'voxk9gcy69ri' } },
      id: 'post',
      type: 'ContentType',
      createdAt: '2019-06-03T13:35:42.101Z',
      updatedAt: '2019-08-30T11:11:22.366Z',
      environment: {
        sys: { id: Cypress.env('activeEnvironmentId'), type: 'Link', linkType: 'Environment' }
      },
      revision: 8
    },
    name: 'Post',
    description: null,
    displayField: 'title',
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: false,
        required: true,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: 'body',
        name: 'Body',
        type: 'Text',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      }
    ]
  },
  {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: 'voxk9gcy69ri' } },
      id: 'postWithCustomEntryEditor',
      type: 'ContentType',
      createdAt: '2019-07-09T12:04:59.371Z',
      updatedAt: '2019-07-09T12:06:44.708Z',
      environment: {
        sys: { id: Cypress.env('activeEnvironmentId'), type: 'Link', linkType: 'Environment' }
      },
      revision: 5
    },
    name: 'Post with Custom Entry Editor',
    description: '',
    displayField: 'title',
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: false,
        required: true,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: 'body',
        name: 'Body',
        type: 'Text',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      }
    ]
  },
  {
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: 'voxk9gcy69ri' } },
      id: 'postWithSidebar',
      type: 'ContentType',
      createdAt: '2019-07-09T09:17:57.208Z',
      updatedAt: '2019-07-09T09:56:52.352Z',
      environment: {
        sys: { id: Cypress.env('activeEnvironmentId'), type: 'Link', linkType: 'Environment' }
      },
      revision: 4
    },
    name: 'Post with Sidebar',
    description: '',
    displayField: 'title',
    fields: [
      {
        id: 'title',
        name: 'Title',
        type: 'Symbol',
        localized: false,
        required: true,
        validations: [],
        disabled: false,
        omitted: false
      },
      {
        id: 'body',
        name: 'Body',
        type: 'Text',
        localized: false,
        required: false,
        validations: [],
        disabled: false,
        omitted: false
      }
    ]
  }
]
