import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'

export default function OpenEntryButton({ sdk, entryId, onOpen, canSlideIn }) {
  return (
    <>
      <Button
        className="f36-margin-right--m"
        buttonType="muted"
        onClick={() => {
          sdk.navigator.openEntry(entryId).then(() => {
            onOpen()
          })
        }}
        testId="open-entry-button">
        open entry
      </Button>
      <Button
        buttonType="muted"
        disabled={!canSlideIn}
        onClick={() => {
          sdk.navigator
            .openEntry(entryId, {
              slideIn: true
            })
            .then(() => {
              onOpen()
            })
        }}
        testId="open-entry-slidein-button">
        {!canSlideIn ? '[not supported]' : ''} open entry (slide-in)
      </Button>
    </>
  )
}

OpenEntryButton.propTypes = {
  sdk: PropTypes.object.isRequired,
  entryId: PropTypes.string.isRequired,
  onOpen: PropTypes.func,
  canSlideIn: PropTypes.bool
}

OpenEntryButton.defaultProps = {
  onOpen: () => {},
  canSlideIn: true
}
