import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from '@contentful/forma-36-react-components'
import { OpenDialogExtensionButton } from './components'

export function PageExtension({ sdk }) {
  return (
    <div data-test-id="my-page-extension">
      hello page extension
      <div>
        <pre>{JSON.stringify(sdk.parameters.invocation)}</pre>
      </div>
      <Button
        testId="open-new-path-button"
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
      <Card className="f36-margin--l">
        <OpenDialogExtensionButton sdk={sdk} />
      </Card>
    </div>
  )
}

PageExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
