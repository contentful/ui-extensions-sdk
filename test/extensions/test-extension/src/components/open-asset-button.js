import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'
import { actionSelectors } from '../../../../constants'

export default function OpenAssetButton({ sdk, assetId, onOpen, canSlideIn }) {
  return (
    <>
      <Button
        className="f36-margin-right--m"
        buttonType="muted"
        onClick={() => {
          sdk.navigator.openAsset(assetId).then(() => {
            onOpen()
          })
        }}
        testId={actionSelectors.openAsset}>
        open asset
      </Button>
      <Button
        buttonType="muted"
        disabled={!canSlideIn}
        onClick={() => {
          sdk.navigator
            .openAsset(assetId, {
              slideIn: true
            })
            .then(() => {
              onOpen()
            })
        }}
        testId={actionSelectors.openAssetSlideIn}>
        {!canSlideIn ? '[not supported]' : ''} open asset (slide-in)
      </Button>
    </>
  )
}

OpenAssetButton.propTypes = {
  sdk: PropTypes.object.isRequired,
  assetId: PropTypes.string.isRequired,
  onOpen: PropTypes.func,
  canSlideIn: PropTypes.bool
}

OpenAssetButton.defaultProps = {
  onOpen: () => {},
  canSlideIn: true
}
