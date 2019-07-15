import React from 'react'
import PropTypes from 'prop-types'
import { TextInput, Card, Heading } from '@contentful/forma-36-react-components'
import { OpenPageExtensionButton, OpenDialogExtensionButton, OpenEntryButton } from './components'
import * as Constants from '../../../constants'

export class FieldExtension extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.sdk.field.getValue()
    }
    this.detachExternalChangeHandler = null
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()

    // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
    this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange)
  }

  componentWillUnmount() {
    if (this.detachExternalChangeHandler) {
      this.detachExternalChangeHandler()
    }
  }

  onExternalChange = value => {
    this.setState({ value })
  }

  onChange = e => {
    const value = e.currentTarget.value
    this.setState({ value })
    if (value) {
      this.props.sdk.field.setValue(value)
    } else {
      this.props.sdk.field.removeValue()
    }
  }

  render = () => {
    return (
      <>
        <TextInput
          width="large"
          type="text"
          id="my-field"
          value={this.state.value}
          onChange={this.onChange}
        />
        <Card className="f36-margin-top--l" title="Navigator">
          <Heading className="f36-margin-bottom--m">
            <code>sdk.navigator & sdk.dialogs</code>
          </Heading>
          <div className="f36-margin-bottom--m">
            <OpenPageExtensionButton sdk={this.props.sdk} />
          </div>
          <div className="f36-margin-bottom--m">
            <OpenDialogExtensionButton sdk={this.props.sdk} />
          </div>
          <div>
            <OpenEntryButton sdk={this.props.sdk} entryId={Constants.entries.testImageWrapper} />
          </div>
        </Card>
      </>
    )
  }
}

FieldExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
