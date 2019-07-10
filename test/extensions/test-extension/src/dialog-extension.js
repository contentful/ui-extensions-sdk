import React from 'react'
import PropTypes from 'prop-types'
import { OpenPageExtensionButton } from './components'

export function DialogExtension({ sdk }) {
  return (
    <>
      <div>
        <OpenPageExtensionButton
          sdk={sdk}
          onNavigated={() => {
            sdk.close()
          }}>
          open page extension with closing dialog
        </OpenPageExtensionButton>
      </div>
      <div>
        <OpenPageExtensionButton sdk={sdk}>
          open page extension without closing dialog
        </OpenPageExtensionButton>
      </div>
    </>
  )
}

DialogExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
