import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'
import * as Constants from '../../../constants'
import { DialogExtensionSDK } from 'contentful-ui-extensions-sdk'

export function DialogExtension({ sdk }: { sdk: DialogExtensionSDK }) {
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
