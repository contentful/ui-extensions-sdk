/* eslint-disable import/first */
require('dotenv').config()

import buildExtensions from './tasks/build-extensions'
import deployExtensions from './tasks/deploy-extensions'
import {
  createCypressConfiguration,
  createExtensionConfiguration,
} from './tasks/create-configuration-files'
import idsData from '../cypress/integration/fixtures/ids-data.json'

const config = {
  managementToken: process.env.CONTENTFUL_CMA_TOKEN!,
  spaceId: process.env.CONTENTFUL_SPACE_ID!,
  baseUrl: process.env.CONTENTFUL_APP!,
  environmentId: process.env.CONTENTFUL_LOCAL_TESTING_ENV!,
  testLocalSdk: process.env.TEST_LOCAL_SDK === 'true',
}

const entryIds = {
  entryEditorExtension: idsData.entryEditorExtension.entry,
  fieldExtension: idsData.fieldExtension.entry,
  sidebarExtension: idsData.sidebarExtension.entry,
  onValueChanged: idsData.onValueChanged.entry,
}

function listAllEnvironmentVariables() {
  ;[
    'CONTENTFUL_SPACE_ID',
    'CYPRESS_baseUrl',
    'TEST_LOCAL_SDK',
    'CONTENTFUL_LOCAL_TESTING_ENV',
  ].forEach((envvar) => {
    console.log(`${envvar}=${process.env[envvar]}`)
  })
  ;['CONTENTFUL_CMA_TOKEN'].forEach((envvar) => {
    console.log(`${envvar}=${(process.env[envvar] || '').slice(0, 5)}...`)
  })
}

async function run() {
  if (config.environmentId === 'master') {
    throw new Error('Do not run tests on `master` enviroment.')
  }

  listAllEnvironmentVariables()

  await createExtensionConfiguration({
    managementToken: config.managementToken,
    spaceId: config.spaceId,
    environmentId: config.environmentId,
  })
  await buildExtensions({
    testLocalSdk: config.testLocalSdk,
  })
  await deployExtensions()

  await createCypressConfiguration({
    managementToken: config.managementToken,
    spaceId: config.spaceId,
    environmentId: config.environmentId,
    role: 'admin',
    entries: entryIds,
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
