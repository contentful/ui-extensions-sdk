import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { Button } from '@contentful/forma-36-react-components'
import { init } from 'contentful-ui-extensions-sdk'
import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'

function App({ sdk }) {
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

App.propTypes = {
  sdk: PropTypes.object.isRequired
}

init(sdk => {
  render(<App sdk={sdk} />, document.getElementById('root'))
})
