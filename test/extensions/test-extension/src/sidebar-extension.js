import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'
import { OpenPageExtensionButton, OpenDialogExtensionButton } from './components'

export function SidebarExtension({ sdk }) {
  return (
    <div data-test-id="cf-ui-sidebar-extension">
      <div>
        <Button testId="sidebar-button">Click me</Button>
      </div>
      <div>
        <OpenPageExtensionButton sdk={sdk} />
      </div>
      <div>
        <OpenDialogExtensionButton sdk={sdk} />
      </div>
    </div>
  )
}

SidebarExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
