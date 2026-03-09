import { ExperienceSnapshot } from '../../lib/types'

export const mockExperienceSnapshot: ExperienceSnapshot = {
  sys: {
    id: 'exp-123',
    type: 'Experience',
    version: 1,
  },
}

export const mockExoInit = {
  uiMode: 'form' as const,
  experience: mockExperienceSnapshot,
}

export const mockExoInitVisualMode = {
  uiMode: 'visual' as const,
  experience: mockExperienceSnapshot,
}
