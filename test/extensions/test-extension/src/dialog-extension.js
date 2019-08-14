import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'
import * as Constants from '../../../constants'

export function DialogExtension({ sdk }) {
  useEffect(() => {
    return sdk.window.startAutoResizer()
  }, [])

  return (
    <div data-test-id={Constants.actionSelectors.dialogWrapper}>
      <Button
        onClick={() => {
          sdk.close()
        }}>
        Close
      </Button>
    </div>
  )
}

DialogExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
