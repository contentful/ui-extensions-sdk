import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'

export function PageExtension({ sdk }) {
  return (
    <div data-test-id="cf-ui-page-extension">
      hello page extension
      <div>
        <pre>{JSON.stringify(sdk.parameters.invocation)}</pre>
      </div>
      <Button
        onClick={() => {
          sdk.navigator.openPageExtension({ path: '/new' })
        }}>
        go to `new` route
      </Button>
      <Button
        onClick={() => {
          sdk.navigator.openPageExtension({ path: '/root' })
        }}>
        go home
      </Button>
    </div>
  )
}

PageExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
