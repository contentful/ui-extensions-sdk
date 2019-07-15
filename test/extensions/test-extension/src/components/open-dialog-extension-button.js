import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'
import { actionSelectors } from '../../../../constants'

export default function OpenDialogExtensionButton({ sdk }) {
  return (
    <Button
      buttonType="muted"
      onClick={() => {
        sdk.dialogs.openExtension({
          title: 'My awesome dialog extension'
        })
      }}
      testId={actionSelectors.openDialogExtension}>
      open dialog extension
    </Button>
  )
}

OpenDialogExtensionButton.propTypes = {
  sdk: PropTypes.object.isRequired
}
