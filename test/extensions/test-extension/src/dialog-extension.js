import React from 'react'
import PropTypes from 'prop-types'
import { OpenPageExtensionButton } from './components'

export function DialogExtension({ sdk }) {
  return (
    <>
      <div>
        <OpenPageExtensionButton
          testId="open-page-extension-button"
          sdk={sdk}
          onNavigated={() => {
            sdk.close()
          }}>
          open page extension with closing dialog
        </OpenPageExtensionButton>
      </div>
      <div>
        <OpenPageExtensionButton sdk={sdk} testId="open-page-extension-button-without-closing">
          open page extension without closing dialog
        </OpenPageExtensionButton>
      </div>
    </>
  )
}

DialogExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
