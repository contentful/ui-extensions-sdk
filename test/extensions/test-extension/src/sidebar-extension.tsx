import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'
import * as Constants from '../../../constants'
import { SidebarExtensionSDK } from 'contentful-ui-extensions-sdk'

export function SidebarExtension({ sdk }: { sdk: SidebarExtensionSDK }) {
  useEffect(() => {
    return sdk.window.startAutoResizer()
  }, [])

  return (
    <div data-test-id="cf-ui-sidebar-extension">
      <div className="f36-margin-bottom--l">
        <Button testId={Constants.actionSelectors.sidebarButton}>Click me</Button>
      </div>
    </div>
  )
}

SidebarExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
