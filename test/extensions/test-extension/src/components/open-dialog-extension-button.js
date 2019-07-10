import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'

export default function OpenDialogExtensionButton({ sdk }) {
  return (
    <Button
      buttonType="muted"
      onClick={() => {
        sdk.dialogs.openExtension({
          title: 'My awesome dialog extension'
        })
      }}
      testId="open-dialog-extension-button">
      open dialog extension
    </Button>
  )
}

OpenDialogExtensionButton.propTypes = {
  sdk: PropTypes.object.isRequired
}
