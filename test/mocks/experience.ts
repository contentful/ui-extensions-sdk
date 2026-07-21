import { ExperienceSnapshot } from '../../lib/types'

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
