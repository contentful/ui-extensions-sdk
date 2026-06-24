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

export const mockExperienceInit = {
  uiMode: 'form' as const,
  experience: mockExperienceSnapshot,
}

export const mockExperienceInitVisualMode = {
  uiMode: 'visual' as const,
  experience: mockExperienceSnapshot,
}
