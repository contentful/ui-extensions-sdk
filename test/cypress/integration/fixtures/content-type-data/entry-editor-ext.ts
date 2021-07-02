export default {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: Cypress.env('activeSpaceId'),
      },
    },
    id: 'postWithCustomEntryEditor',
    type: 'ContentType',
    createdAt: '2019-07-09T12:04:59.371Z',
    updatedAt: '2019-07-09T12:06:44.708Z',
    environment: {
      sys: {
        id: Cypress.env('activeEnvironmentId'),
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 5,
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
