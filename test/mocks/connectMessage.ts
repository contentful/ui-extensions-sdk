import { ConnectMessage } from '../../lib/types'

export const baseConnectMessage: ConnectMessage = {
  id: 'test-app-id',
  location: 'entry-field',
  user: {
    sys: {
      id: 'user-123',
      type: 'User',
    },
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    avatarUrl: 'https://example.com/avatar.png',
    spaceMembership: {
      sys: {
        id: 'membership-123',
        type: 'SpaceMembership',
      },
      admin: false,
      roles: [
        {
          name: 'Developer',
          description: 'Developer role',
        },
      ],
    },
  },
  parameters: {
    installation: {},
    instance: {},
    invocation: undefined as any,
  },
  locales: {
    available: ['en-US', 'de-DE'],
    default: 'en-US',
    names: {
      'en-US': 'English (United States)',
      'de-DE': 'German (Germany)',
    },
    fallbacks: {
      'de-DE': 'en-US',
    },
    optional: {
      'de-DE': true,
    },
    direction: {
      'en-US': 'ltr',
      'de-DE': 'ltr',
    },
  },
  initialContentTypes: [],
  ids: {
    user: 'user-123',
    extension: 'test-extension-id',
    organization: 'org-123',
    app: 'app-123',
    space: 'test-space',
    environment: 'master',
    environmentAlias: undefined,
    field: 'test-field',
    entry: 'test-entry',
    contentType: 'test-content-type',
  },
  contentType: {
    sys: {
      id: 'test-content-type',
      type: 'ContentType',
      revision: 1,
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'test-space',
        },
      },
      environment: {
        sys: {
          type: 'Link',
          linkType: 'Environment',
          id: 'master',
        },
      },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    fields: [],
    name: 'Test Content Type',
    displayField: 'title',
    description: 'A test content type',
  },
  editorInterface: {
    sys: {
      id: 'test-editor-interface',
      type: 'EditorInterface',
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'test-space',
        },
      },
      environment: {
        sys: {
          type: 'Link',
          linkType: 'Environment',
          id: 'master',
        },
      },
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'test-content-type',
        },
      },
      version: 1,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
    },
    controls: [],
    sidebar: [],
  },
  editor: {
    localeSettings: {
      'en-US': { focused: true, enabled: true },
      'de-DE': { focused: false, enabled: true },
    },
    showHiddenFields: false,
  },
  entry: {
    sys: {
      id: 'test-entry',
      type: 'Entry',
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'test-space',
        },
      },
      environment: {
        sys: {
          type: 'Link',
          linkType: 'Environment',
          id: 'master',
        },
      },
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'test-content-type',
        },
      },
      version: 1,
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      automationTags: [],
    },
    metadata: {
      tags: [],
      concepts: [],
    },
  },
  fieldInfo: [
    {
      id: 'test-field',
      name: 'Test Field',
      type: 'Symbol',
      locales: ['en-US', 'de-DE'],
      required: false,
      validations: [],
      values: {
        'en-US': 'Test value',
        'de-DE': 'Test Wert',
      },
      isDisabled: {
        'en-US': false,
        'de-DE': false,
      },
      schemaErrors: {
        'en-US': [],
        'de-DE': [],
      },
    },
  ],
  field: {
    id: 'test-field',
    name: 'Test Field',
    type: 'Symbol',
    locale: 'en-US',
    required: false,
    validations: [],
    value: 'Test value',
    isDisabled: false,
    schemaErrors: [],
  },
  hostnames: {
    delivery: 'cdn.contentful.com',
    management: 'api.contentful.com',
    preview: 'preview.contentful.com',
    upload: 'upload.contentful.com',
    graphql: 'graphql.contentful.com',
    webapp: 'app.contentful.com',
  },
} as any // Type assertion to work with complex nested types in testing

export default baseConnectMessage
