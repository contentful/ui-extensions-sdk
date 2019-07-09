import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'

export function SidebarExtension() {
  return (
    <div data-test-id="cf-ui-sidebar-extension">
      <Button testId="sidebar-button">Click me</Button>
    </div>
  )
}

SidebarExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
