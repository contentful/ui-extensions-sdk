import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button, Heading, Card } from '@contentful/forma-36-react-components'
import {
  OpenPageExtensionButton,
  OpenDialogExtensionButton,
  OpenEntryButton,
  OpenAssetButton
} from './components'
import * as Constants from '../../../constants'

export function SidebarExtension({ sdk }) {
  useEffect(() => {
    return sdk.window.startAutoResizer()
  }, [])

  return (
    <div data-test-id="cf-ui-sidebar-extension">
      <div className="f36-margin-bottom--l">
        <Button testId={Constants.actionSelectors.sidebarButton}>Click me</Button>
      </div>

      <Card className="f36-margin-top--l" title="Navigator">
        <Heading className="f36-margin-bottom--m">
          <code>sdk.navigator & sdk.dialogs</code>
        </Heading>
        <div className="f36-margin-bottom--m">
          <OpenPageExtensionButton sdk={sdk} />
        </div>
        <div className="f36-margin-bottom--m">
          <OpenDialogExtensionButton sdk={sdk} />
        </div>
        <div className="f36-margin-bottom--m">
          <OpenEntryButton sdk={sdk} entryId={Constants.entries.testImageWrapper} />
        </div>
        <div>
          <OpenAssetButton sdk={sdk} assetId={Constants.assets.testImage} />
        </div>
      </Card>
    </div>
  )
}

SidebarExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
