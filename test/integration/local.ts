/* eslint-disable import/first */
import { createFixtures } from './tasks/create-fixtures'

require('dotenv').config()

import buildExtensions from './tasks/build-extensions'
import deployExtensions from './tasks/deploy-extensions'
import createNewEnvironment from './tasks/create-new-environment'
import {
  createCypressConfiguration,
  createExtensionConfiguration,
} from './tasks/create-configuration-files'

const config = {
  managementToken: process.env.CONTENTFUL_CMA_TOKEN!,
  spaceId: process.env.CONTENTFUL_SPACE_ID!,
  baseUrl: process.env.CONTENTFUL_APP!,
  host: process.env.CONTENTFUL_HOST || 'api.contentful.com',
  environmentId: process.env.CONTENTFUL_LOCAL_TESTING_ENV!,
  aliasId: process.env.CONTENTFUL_LOCAL_TESTING_ALIAS!,
  testLocalSdk: process.env.TEST_LOCAL_SDK === 'true',
}

function listAllEnvironmentVariables() {
  ;[
    'CONTENTFUL_SPACE_ID',
    'CYPRESS_baseUrl',
    'TEST_LOCAL_SDK',
    'CONTENTFUL_LOCAL_TESTING_ENV',
    'CONTENTFUL_HOST',
  ].forEach((envvar) => {
    console.log(`${envvar}=${process.env[envvar]}`)
  })
  ;['CONTENTFUL_CMA_TOKEN'].forEach((envvar) => {
    console.log(`${envvar}=${(process.env[envvar] || '').slice(0, 5)}...`)
  })
}

async function run() {
  if (config.environmentId === 'master') {
    throw new Error('Do not run tests on `master` environment.')
  }

  await createFixtures(config.spaceId)

  listAllEnvironmentVariables()

  const eid = await createNewEnvironment()

  config.environmentId = eid

  await createExtensionConfiguration({
    managementToken: config.managementToken,
    spaceId: config.spaceId,
    environmentId: config.environmentId,
    host: config.host,
  })
  await buildExtensions({
    testLocalSdk: config.testLocalSdk,
  })
  await deployExtensions()

  const idsData = require('../cypress/integration/fixtures/ids-data.json')

  await createCypressConfiguration({
    managementToken: config.managementToken,
    spaceId: config.spaceId,
    environmentId: config.environmentId,
    aliasId: config.aliasId,
    role: 'editorMasterOnly',
    entries: {
      entryEditorExtension: idsData.entryEditorExtension.entry,
      fieldExtension: idsData.fieldExtension.entry,
      sidebarExtension: idsData.sidebarExtension.entry,
      onValueChanged: idsData.onValueChanged.entry,
    },
  })
}

/**
 * When running tests locally we don't create a new environment programmatically
 */
;(async function main() {
  try {
    await run()
    process.exit(0)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
})()
