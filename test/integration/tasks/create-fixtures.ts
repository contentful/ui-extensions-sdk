import { printStepTitle, resolvePath, writeJSONFile } from '../utils'
import { getUsersByRole } from '../contentful-client'

export async function createFixtures(spaceId: string) {
  printStepTitle('Creating fixtures based on environment variables')

  const { admin, editor, editorMasterOnly, permissionTest } = await getUsersByRole()

  writeJSONFile(resolvePath(`test/cypress/integration/fixtures/user-data.json`), {
    admin,
    editor,
    editorMasterOnly,
    permissionTest,
  })

  console.log(`Created test/cypress/integration/fixtures/user-data.json`)

  writeJSONFile(resolvePath(`test/cypress/integration/fixtures/ids-data.json`), {
    entryEditorExtension: {
      entry: '5mwUiJB2kThfAG9ZnRNuNQ',
      contentType: 'postWithCustomEntryEditor',
    },
    fieldExtension: {
      entry: '1MDrvtuLDk0PcxS5nCkugC',
      contentType: 'post',
      field: 'title',
    },
    sidebarExtension: {
      entry: '3MEimIRakHkmgmqvp1oIsM',
      contentType: 'postWithSidebar',
      field: 'title',
    },
    onValueChanged: {
      entry: '5KnnZPwiIq1RNctf1Q1uNl',
      contentType: 'postWithCustomEntryEditor',
    },
    extension: 'test-extension',
    space: spaceId,
    user: {
      admin: admin.sys.id,
      editor: editor.sys.id,
      editorMasterOnly: editorMasterOnly.sys.id,
      permissionTest: permissionTest.sys.id,
    },
  })

  console.log(`Created test/cypress/integration/fixtures/ids-data.json`)
}
