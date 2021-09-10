import { role } from '../utils/role'
import '@testing-library/cypress/add-commands'
import { configure } from '@testing-library/cypress'
import { widgetLocation } from '../../constants'

configure({ testIdAttribute: 'data-test-id' })

const post = {
  id: Cypress.env('entries').onValueChanged,
}

const iframeSelector = '[data-test-id="cf-ui-workbench-content"] iframe'
const entryExtensionSelector = 'cf-ui-card'

// @ts-expect-error "cy.state" is not in the "cy" type
const getMochaContext = () => cy.state('runnable').ctx
const skip = () => {
  const ctx = getMochaContext()
  return ctx.skip()
}

context(`Entry editor extension (${role})`, () => {
  before(() => {
    if (role !== 'permissionTest') {
      return skip()
    }
  })
  beforeEach(() => {
    cy.setupBrowserStorage()
    cy.visitEntryWithRetry(post.id)

    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(entryExtensionSelector, widgetLocation.entryEditor)
    cy.get('[data-test-id="cf-ui-workbench-content"]').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('verifies that access.can works with custom role', () => {
    cy.getSdk(iframeSelector).then(async (sdk) => {
      const canTitle = await sdk.access.can('update', {
        sys: { type: 'Entry', id: post.id },
        fields: {
          title: { 'en-US': 'hello!' },
        },
      })
      expect(canTitle).to.be.equal(false)

      const canBody = await sdk.access.can('update', {
        sys: { type: 'Entry', id: post.id },
        fields: {
          body: { 'en-US': 'hello!' },
        },
      })
      expect(canBody).to.be.equal(true)
    })
  })
  it('verifies that you cannot change fields when not allowed', () => {
    cy.getSdk(iframeSelector).then(async (sdk) => {
      const newValue = `The current time is: ${Date.now()}`
      try {
        await sdk.entry.fields.title.setValue(newValue)
      } catch (err) {
        const errorCode = err.code.code || err.code
        expect(errorCode).to.be.equal('NOT ENOUGH PERMISSIONS')
      }
      // check that the value has not been changed
      const returnValueNotChanged = await sdk.entry.fields.body.getValue()
      expect(returnValueNotChanged).to.not.be.equal(newValue)
      const returnValue = await sdk.entry.fields.body.setValue(newValue)
      expect(returnValue).to.be.equal(newValue)
    })
  })
})
