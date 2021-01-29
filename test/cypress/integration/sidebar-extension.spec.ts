import { entry } from '../utils/paths'
import * as Constants from '../../constants'
import { verifyLocation } from '../utils/verify-location'
import {
  verifySdkInstallationParameters,
  verifySdkInstanceParameters
} from '../utils/verify-parameters'
import idsData from './fixtures/ids-data.json'
import contentTypeData from './fixtures/content-type-data/sidebar-ext.json'
import { ContentType, EntryAPI, SidebarExtensionSDK } from '../../../lib/types'

const post = {
  id: '3MEimIRakHkmgmqvp1oIsM',
  title: 'My post with a custom sidebar'
}

const entryApiPost = {
  id: '63gpU2K9212OoCsi77adYu',
}

// At the time of writing there's no way to turn off notifications for
// assigned tasks, so this is a dummy user that we have created to absorb
// the notifications
const userId = '1C5PnMGIN7CC48PgORg8tp'

const iframeSelector = '[data-test-id="entry-editor-sidebar"] iframe'
const sidebarExtension = 'cf-ui-sidebar-extension'

context('Sidebar extension', () => {
  beforeEach(() => {
    cy.setupBrowserStorage()
    cy.visit(entry(post.id))
    cy.findByTestId('workbench-title').should($title => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(sidebarExtension)

    cy.findByTestId('entry-editor-sidebar').within(() => {
      cy.get('iframe')
        .should('have.length', 1)
        .captureIFrameAs('extension')
    })
  })

  it('opens first post and checks that sidebar extension is rendered', () => {
    cy.get('@extension').within(() => {
      cy.findByTestId(Constants.actionSelectors.sidebarButton).should('exist')
    })
  })

  it('verifies sdk.ids static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      expect(sdk.ids.contentType).to.equal(idsData.sidebarExtension.contentType)
      expect(sdk.ids.entry).to.equal(idsData.sidebarExtension.entry)
      expect(sdk.ids.field).to.equal(undefined)
      expect(sdk.ids.environment).to.equal(Cypress.env('activeEnvironmentId'))
      expect(sdk.ids.extension).to.equal(idsData.extension)
      expect(sdk.ids.space).to.equal(idsData.space)
      expect(sdk.ids.user).to.equal(idsData.user)
    })
  })

  it('verifies sdk.contentType static methods have expected values', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      contentTypeData.sys.environment.sys.id = Cypress.env('activeEnvironmentId')
      expect(sdk.contentType).to.deep.equal(contentTypeData)
    })
  })

  it('verifies sdk.location.is entry-sidebar', () => {
    cy.getSdk(iframeSelector).then(sdk => {
      verifyLocation(sdk, 'entry-sidebar')
    })
  })

  it('verifies sdk.parameters have expected values', () => {
    cy.getSdk(iframeSelector).then(() => {
      verifySdkInstallationParameters(iframeSelector)
      verifySdkInstanceParameters(iframeSelector)
    })
  })

  it('creates, gets, and deletes a content type through spaceAPI', () => {
    cy.getSdk(iframeSelector).then(async (sdk: SidebarExtensionSDK) => {
      const ct = await sdk.space.createContentType<ContentType>({ name: 'Pog Blost', fields: [] })
      const sameCt = await sdk.space.getContentType(ct.sys.id)
      expect(ct).to.deep.equal(sameCt)
      const deleteRes = await sdk.space.deleteContentType(ct.sys.id)
      expect(deleteRes).to.equal(undefined)
    })
  })

  it('calls tasks API on current entry', () => {
    cy.getSdk(iframeSelector).then(async (sdk: SidebarExtensionSDK) => {
      const task = await sdk.entry.createTask({
        assignedToId: userId,
        body: "Can't publish this.",
        status: 'active',
      })
      expect(task.assignedTo.sys.id).to.equal(userId)
      const newBody = 'New task description'
      task.body = newBody
      await sdk.entry.updateTask(task)
      const updatedTask = await sdk.entry.getTask(task.sys.id)
      expect(updatedTask.body).to.equal(newBody)
    })
  })
  /* Reusable tests */
})
