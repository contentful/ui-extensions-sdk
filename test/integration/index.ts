/* eslint-disable import/first */
import { testAliasId } from './utils'

require('dotenv').config()

import asyncRetry from 'async-retry'
import buildExtensions from './tasks/build-extensions'
import copyEntries from './tasks/copy-entries'
import {
  createCypressConfiguration,
  createExtensionConfiguration,
} from './tasks/create-configuration-files'
import createEnvironment from './tasks/create-new-environment'
import deleteEnvironment from './tasks/delete-new-environment'
import deleteStaleEnvironments from './tasks/delete-stale-environments'
import deployExtensions from './tasks/deploy-extensions'
import runCypress from './tasks/run-cypress'
import deleteEntries from './tasks/delete-entries'
import { createFixtures } from './tasks/create-fixtures'
import deleteStaleEntries from './tasks/delete-stale-entries'

const config = {
  managementTokenAdmin: process.env.CONTENTFUL_CMA_TOKEN!,
  host: process.env.CONTENTFUL_HOST || 'api.contentful.com',
  managementTokenEditor: process.env.CONTENTFUL_CMA_TOKEN_EDITOR!,
  managementTokenEditorMasterOnly: process.env.CONTENTFUL_CMA_TOKEN_EDITOR_MASTER_ONLY!,
  managementTokenPermissionTestOnly: process.env.CONTENTFUL_CMA_TOKEN_PERMISSION_TEST_ONLY!,
  spaceId: process.env.CONTENTFUL_SPACE_ID!,
  baseUrl: process.env.CONTENTFUL_APP!,
  testLocalSdk: process.env.TEST_LOCAL_SDK === 'true',
}

function listAllEnvironmentVariables() {
  ;['CONTENTFUL_SPACE_ID', 'CYPRESS_baseUrl', 'TEST_LOCAL_SDK'].forEach((envvar) => {
    console.log(`${envvar}=${process.env[envvar]}`)
  })
  ;[
    'CONTENTFUL_CMA_TOKEN',
    'CONTENTFUL_CMA_TOKEN_EDITOR',
    'CONTENTFUL_CMA_TOKEN_EDITOR_MASTER_ONLY',
    'CONTENTFUL_CMA_TOKEN_PERMISSION_TEST_ONLY',
  ].forEach((envvar) => {
    console.log(`${envvar}=${(process.env[envvar] || '').slice(0, 5)}...`)
  })
}

let tempEnvironmentId: any
const tempEntries: { environmentId: string; entryId: string }[] = []

const cleanup = async () => {
  if (tempEnvironmentId) {
    try {
      await asyncRetry(() => deleteEnvironment(tempEnvironmentId), { retries: 3 })
    } catch (e) {
      console.log(e)
      throw new Error('Failed to remove environment')
    }
  }

  if (tempEntries.length > 0) {
    await deleteEntries(tempEntries)
  }
}

const run = async () => {
  await buildExtensions({
    testLocalSdk: config.testLocalSdk,
  })

  listAllEnvironmentVariables()

  try {
    await deleteStaleEnvironments()
  } catch (e) {
    console.error('Could not delete all stale environments')
  }

  try {
    await deleteStaleEntries()
  } catch (e) {
    console.error('Could not delete all stale entries')
  }

  try {
    tempEnvironmentId = await asyncRetry(
      () => {
        return createEnvironment()
      },
      { retries: 3 }
    )
  } catch (e) {
    console.log(e)
    throw new Error('Failed to create a new environment')
  }

  await createExtensionConfiguration({
    managementToken: config.managementTokenAdmin,
    spaceId: config.spaceId,
    environmentId: tempEnvironmentId,
    host: config.host,
  })
  await deployExtensions()

  await createFixtures(config.spaceId)

  const idsData = require('../cypress/integration/fixtures/ids-data.json')
  const entryIds = {
    entryEditorExtension: idsData.entryEditorExtension.entry,
    fieldExtension: idsData.fieldExtension.entry,
    sidebarExtension: idsData.sidebarExtension.entry,
    onValueChanged: idsData.onValueChanged.entry,
  }

  // Permission test only
  await createCypressConfiguration({
    managementToken: config.managementTokenPermissionTestOnly,
    spaceId: config.spaceId,
    environmentId: 'master',
    aliasId: testAliasId,
    role: 'permissionTest',
    entries: entryIds,
  })

  await runCypress('permission', { permissionTestOnly: true })

  // Admin
  await createCypressConfiguration({
    managementToken: config.managementTokenAdmin,
    spaceId: config.spaceId,
    environmentId: tempEnvironmentId,
    aliasId: testAliasId,
    role: 'admin',
    entries: entryIds,
  })

  await runCypress('admin')

  // Editor
  await createCypressConfiguration({
    managementToken: config.managementTokenEditor,
    spaceId: config.spaceId,
    environmentId: tempEnvironmentId,
    aliasId: testAliasId,
    role: 'editor',
    entries: entryIds,
  })
  await runCypress('editor', { initializeTestOnly: true })

  // Editor (master only)
  const newEntryIds = await copyEntries(entryIds)
  tempEntries.push(
    ...Object.values(newEntryIds).map((entryId) => ({ environmentId: 'master-test', entryId }))
  )

  await createCypressConfiguration({
    managementToken: config.managementTokenEditorMasterOnly,
    spaceId: config.spaceId,
    environmentId: 'master-test',
    aliasId: testAliasId,
    role: 'editorMasterOnly',
    entries: newEntryIds,
  })
  await runCypress('editorMasterOnly', { initializeTestOnly: true })
}
;(async function main() {
  try {
    await run()
    await cleanup()
  } catch (err) {
    console.error(err)
    await cleanup().catch(console.error)
    process.exit(1)
  }
})()
