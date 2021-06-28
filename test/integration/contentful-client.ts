import { createClient } from 'contentful-management'
import {
  RoleProps,
  SpaceMemberProps,
  UserProps,
} from 'contentful-management/dist/typings/export-types'

if (!process.env.CONTENTFUL_CMA_TOKEN) {
  require('dotenv').config()
}

export const client = createClient({
  host: process.env.CONTENTFUL_HOST || 'api.contentful.com',
  accessToken: process.env.CONTENTFUL_CMA_TOKEN as string,
})

export const getCurrentSpace = () => client.getSpace(process.env.CONTENTFUL_SPACE_ID as string)

function cleanUser(user: UserProps, spaceMember: SpaceMemberProps, roles: RoleProps[] = []) {
  const { firstName, lastName, email, avatarUrl } = user
  return {
    sys: {
      type: user.sys.type,
      id: user.sys.id,
    },
    firstName,
    lastName,
    email,
    avatarUrl,
    spaceMembership: {
      sys: {
        type: 'SpaceMembership',
        id: spaceMember.sys.id,
      },
      admin: spaceMember.admin,
      roles: roles.map((r: any) => ({
        name: r.name,
        description: r.description,
      })),
    },
  }
}

export const getUsersByRole = async () => {
  const space = await getCurrentSpace()
  const organization = await client.getOrganization(space.sys.organization.sys.id)

  const [users, spaceMembers, spaceRoles] = await Promise.all([
    organization.getUsers(),
    space.getSpaceMembers(),
    space.getRoles(),
  ])

  const result = {
    admin: {} as ReturnType<typeof cleanUser>,
    editor: {} as ReturnType<typeof cleanUser>,
    editorMasterOnly: {} as ReturnType<typeof cleanUser>,
  }

  for (const user of users.items) {
    // @ts-expect-error user is part of space member
    const sm = spaceMembers.items.find((m: SpaceMemberProps) => m.sys.user.sys.id === user.sys.id)

    if (!sm) {
      continue
    }

    if (sm.admin) {
      result.admin = cleanUser(user, sm)
    } else {
      const roles = (sm.roles.map((i) => spaceRoles.items.find((j) => j.sys.id === i.sys.id)) ??
        []) as RoleProps[]

      if (!roles[0]) {
        continue
      }

      const isEditor = roles[0].name === 'Editor'

      if (isEditor) {
        result.editor = cleanUser(user, sm, roles)
      } else {
        result.editorMasterOnly = cleanUser(user, sm, roles)
      }
    }
  }

  return result
}
