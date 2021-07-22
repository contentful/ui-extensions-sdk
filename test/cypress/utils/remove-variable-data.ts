import { ContentType, User } from '../../../lib/types'

// This is fixed in alpha, no point in duplicating the work here
type EnrichedContentType = Omit<ContentType, 'sys'> & {
  sys: ContentType['sys'] & { revision: number }
}

const isUser = (o: any): o is User => o.sys.type === 'User'

/**
 * Removes data from an object which is subject to change
 * based on the environment
 */
export function removeVariableData(obj: EnrichedContentType | User) {
  if (isUser(obj)) {
    // @ts-expect-error for tasks app EAP we allow passing in the teamMemberships but do not expose public types
    const { avatarUrl, teamMemberships, ...user } = obj

    return user
  }

  const { createdAt, updatedAt, revision, ...rest } = obj.sys

  return {
    ...obj,
    sys: rest,
  }
}
