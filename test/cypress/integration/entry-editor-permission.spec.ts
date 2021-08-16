import { role } from '../utils/role'
import { entry, usersList } from '../utils/paths'
import { plainClient } from '../../integration/contentful-client'

const post = {
  id: Cypress.env('entries').onValueChanged,
}

const iframeSelector = '[data-test-id="cf-ui-workbench-content"] iframe'
const entryExtensionSelector = 'cf-ui-card'

context(`Entry editor extension (${role})`, () => {
  beforeEach(() => {
    cy.setupBrowserStorage()
    cy.visitEntryWithRetry(post.id)
    cy.findByTestId('workbench-title').should(($title) => {
      expect($title).to.exist
    })

    cy.waitForIframeWithTestId(entryExtensionSelector)
    cy.get('[data-test-id="cf-ui-workbench-content"]').within(() => {
      cy.get('iframe').captureIFrameAs('extension')
    })
  })

  it('verifies that access.can works with custom role', () => {
    cy.getSdk(iframeSelector).then(async (sdk) => {
      sdk.access
        .can('update', {
          sys: { type: 'Entry', id: post.id },
          fields: {
            title: { 'en-US': 'hello!' },
          },
        })
        .then((can: boolean) => {
          console.log({ can })
          expect(can).to.be.equal(true)
        })
      sdk.access
        .can('update', {
          sys: { type: 'Entry', id: post.id },
          fields: {
            body: { 'en-US': 'hello!' },
          },
        })
        .then((can: boolean) => {
          console.log({ can })
          expect(can).to.be.equal(false)
        })
    })
    //   const spy = cy.stub()
    //   sdk.entry.fields.body.onValueChanged(spy)
    //   expect(spy).to.be.calledOnce
    //   expect(spy).to.be.calledWith('body value')
    //
    //   spy.reset()
    //
    //   cy.get('@extension').within(() => {
    //     cy.findByTestId('body-field').should('exist').and('have.value', post.body)
    //     expect(spy).not.to.be.called
    //     cy.findByTestId('body-field')
    //       .type('updating')
    //       .then(() => {
    //         expect(spy).to.be.called
    //       })
    //   })
    // })
  })
})
