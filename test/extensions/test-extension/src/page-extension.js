import React from 'react'
import PropTypes from 'prop-types'
import { Button, Card, Heading } from '@contentful/forma-36-react-components'
import { OpenEntryButton, OpenAssetButton } from './components'
import * as Constants from '../../../constants'

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
      <Card className="f36-margin--l" title="Navigator">
        <Heading className="f36-margin-bottom--m">
          <code>sdk.navigator & sdk.dialogs</code>
        </Heading>
        <div>
          <OpenEntryButton
            sdk={sdk}
            entryId={Constants.entries.testImageWrapper}
            canSlideIn={false}
          />
        </div>
        <div>
          <OpenAssetButton sdk={sdk} assetId={Constants.assets.testImage} canSlideIn={false} />
        </div>
      </Card>
    </div>
  )
}

PageExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
