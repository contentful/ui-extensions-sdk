import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'

export default function OpenPageExtensionButton({ sdk, onNavigated, children, ...restProps }) {
  const onClick = async () => {
    const { navigated } = await sdk.navigator.openPageExtension()
    if (navigated && typeof onNavigated === 'function') {
      onNavigated()
    }
  }

  return (
    <Button onClick={onClick} testId="open-page-extension-button" {...restProps}>
      {children}
    </Button>
  )
}

OpenPageExtensionButton.propTypes = {
  sdk: PropTypes.object.isRequired,
  onNavigated: PropTypes.func,
  children: PropTypes.any,
  testId: PropTypes.string
}

OpenPageExtensionButton.defaultProps = {
  children: 'open page extension'
}
