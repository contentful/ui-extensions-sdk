import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Heading } from '@contentful/forma-36-react-components'
import { OpenPageExtensionButton, OpenEntryButton } from './components'
import * as Constants from '../../../constants'

export function DialogExtension({ sdk }) {
  useEffect(() => {
    return sdk.window.startAutoResizer()
  }, [])

  return (
    <div data-test-id={Constants.actionSelectors.dialogWrapper} className="f36-padding--l">
      <Heading className="f36-margin-bottom--m">
        <code>sdk.navigator & sdk.dialogs</code>
      </Heading>
      <div className="f36-margin-bottom--m">
        <OpenPageExtensionButton
          testId={Constants.actionSelectors.openPageExtension}
          sdk={sdk}
          onNavigated={() => {
            sdk.close()
          }}>
          open page extension with closing dialog
        </OpenPageExtensionButton>
        <OpenPageExtensionButton
          sdk={sdk}
          testId={Constants.actionSelectors.openPageExtensionNoClose}>
          open page extension without closing dialog
        </OpenPageExtensionButton>
      </div>
      <div>
        <OpenEntryButton
          sdk={sdk}
          entryId={Constants.entries.testImageWrapper}
          canSlideIn={false}
          onOpen={() => {
            sdk.close()
          }}
        />
      </div>
    </div>
  )
}

DialogExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
