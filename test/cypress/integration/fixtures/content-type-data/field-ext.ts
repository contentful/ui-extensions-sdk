export default {
  sys: {
    space: {
      sys: {
        type: 'Link',
        linkType: 'Space',
        id: Cypress.env('activeSpaceId'),
      },
    },
    id: 'post',
    type: 'ContentType',
    createdAt: '2019-06-03T13:35:42.101Z',
    updatedAt: '2019-08-30T11:11:22.366Z',
    environment: {
      sys: {
        id: Cypress.env('activeEnvironmentId'),
        type: 'Link',
        linkType: 'Environment',
      },
    },
    revision: 8,
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
