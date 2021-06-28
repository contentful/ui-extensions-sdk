export default {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: Cypress.env('activeSpaceId'),
      },
    },
    id: 'postWithSidebar',
    type: 'ContentType',
    createdAt: '2019-07-09T09:17:57.208Z',
    updatedAt: '2019-07-09T09:56:52.352Z',
    environment: {
      sys: {
        id: Cypress.env('activeEnvironmentId'),
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 4,
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
      omitted: false,
    },
    {
      id: 'body',
      name: 'Body',
      type: 'Text',
      localized: false,
      required: false,
      validations: [],
      disabled: false,
      omitted: false,
    },
  ],
}
