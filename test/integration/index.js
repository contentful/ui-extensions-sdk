require('dotenv').config()

const path = require('path')
const fs = require('fs-extra')
const buildAndPublishExtensions = require('./tasks/build-and-publish-extensions')
const createContentTypes = require('./tasks/create-content-types')
const deleteContentTypes = require('./tasks/delete-content-types')
const printStepTitle = require('./utils').printStepTitle
const writeJSONFile = require('./utils').writeJSONFile

const rootDirectory = fs.realpathSync(process.cwd())
const resolvePath = relativePath => path.resolve(rootDirectory, relativePath)

;['CONTENTFUL_SPACE', 'CONTENTFUL_CMA_TOKEN', 'CONTENTFUL_ENVIRONMENT'].forEach(envvar => {
  console.log(`${envvar}=${process.env[envvar]}`)
})

const config = {
  cmaToken: process.env.CONTENTFUL_CMA_TOKEN,
  spaceId: process.env.CONTENTFUL_SPACE,
  environmentId: process.env.CONTENTFUL_ENVIRONMENT
}

const run = async () => {
  printStepTitle(`Creating a new content type in the space`)

  try {
    await createContentTypes()
  } catch (e) {
    console.log(e)
    throw new Error('Failed to create content types')
  }

  printStepTitle(`Build extensions and deploy it`)

  await writeJSONFile(resolvePath('test-extensions/test-field-extension/.contentfulrc.json'), {
    cmaToken: config.cmaToken,
    activeSpaceId: config.spaceId,
    activeEnvironmentId: config.environmentId
  })
  await buildAndPublishExtensions()

  // Step 3. Assign extensions to places using CMA

  // Step 4. Run Cypress tests

  printStepTitle('Runnings tests...')
  console.warn('No tests yet.')

  // Step 5. Delete all content using CMA

  printStepTitle('Delete content types')

  try {
    await deleteContentTypes()
  } catch (e) {
    console.log(e)
    throw new Error('Failed to remove content types')
  }

  // Step 7. Delete extensions
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
