import { DataAssemblyParameterDefinition, ExperienceSnapshot } from '../../lib/types'

export const mockExperienceSnapshot: ExperienceSnapshot = {
  sys: {
    id: 'exp-123',
    type: 'Experience',
    version: 1,
    template: {
      sys: {
        type: 'ResourceLink',
        linkType: 'Contentful:Template',
        urn: 'crn:contentful:::content:spaces/sp/templates/tmpl-1',
      },
    },
  },
}

// Legacy fragment vocabulary (current host reads): 'Fragment' + sys.componentType.
export const mockFragmentSnapshot: ExperienceSnapshot = {
  sys: {
    id: 'frag-123',
    type: 'Fragment',
    version: 1,
    componentType: {
      sys: {
        type: 'ResourceLink',
        linkType: 'Contentful:ComponentType',
        urn: 'crn:contentful:::content:spaces/sp/componentTypes/ct-1',
      },
    },
  },
}

// Canonical fragment vocabulary (post-transition host reads): 'ExperienceFragment' + sys.component.
export const mockExperienceFragmentSnapshot: ExperienceSnapshot = {
  sys: {
    id: 'frag-123',
    type: 'ExperienceFragment',
    version: 1,
    component: {
      sys: {
        type: 'ResourceLink',
        linkType: 'Contentful:Component',
        urn: 'crn:contentful:::content:spaces/sp/components/c-1',
      },
    },
  },
}

export const mockExperienceInit = {
  experience: mockExperienceSnapshot,
}

/** Canonical declaration payload returned by the host, in authored order. */
export const mockDataAssemblyParameters: DataAssemblyParameterDefinition[] = [
  {
    id: 'primary',
    name: 'Primary resource',
    description: 'Entry and asset restrictions survive forwarding',
    required: true,
    type: 'ResourceLink',
    allowedResources: [
      {
        type: 'Contentful:Entry',
        source: 'crn:contentful:::content:spaces/$self/environments/$self',
        allowedTypes: ['article'],
      },
      {
        type: 'Contentful:Asset',
        source: 'crn:contentful:::content:spaces/$self/environments/$self',
      },
    ],
  },
  {
    id: 'title',
    name: 'Title',
    required: false,
    type: 'String',
    fallbackValue: '',
    locked: false,
    validation: { allowedValues: ['', 'Heading'] },
  },
  {
    id: 'limit',
    required: false,
    type: 'Number',
    fallbackValue: 0,
    locked: true,
    validation: { min: 0, max: 10 },
  },
  {
    id: 'query',
    description: 'Grouped query settings',
    required: true,
    type: 'Record',
    locked: false,
    fields: [
      { id: 'label', type: 'String', required: false, fallbackValue: '' },
      { id: 'limit', type: 'Number', required: false, fallbackValue: 0 },
      {
        id: 'order',
        type: 'OrderExpression',
        required: false,
        target: { resourceLink: 'primary' },
        fallbackValue: [{ path: 'sys.createdAt', direction: 'desc' }],
      },
    ],
  },
  {
    id: 'order',
    required: false,
    type: 'OrderExpression',
    target: { resourceLink: 'primary' },
    fallbackValue: [],
    locked: false,
  },
]

// Frozen recursively: any attempted mutation by the SDK fails in the contract tests.
function freezePayload<T>(value: T): T {
  if (value !== null && typeof value === 'object') {
    Object.values(value).forEach(freezePayload)
    Object.freeze(value)
  }
  return value
}

freezePayload(mockDataAssemblyParameters)
