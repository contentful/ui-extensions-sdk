import React from 'react'
import PropTypes from 'prop-types'
import { TextInput } from '@contentful/forma-36-react-components'

export class FieldExtension extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      value: props.sdk.field.getValue(),
      isDisabled: true
    }
    this.detachExternalChangeHandler = null
  }

  componentDidMount() {
    this.props.sdk.window.startAutoResizer()

    this.props.sdk.field.onIsDisabledChanged(value => {
      this.setState({ isDisabled: value !== false })
    })

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
          disabled={this.state.isDisabled}
          value={this.state.value}
          onChange={this.onChange}
        />
      </>
    )
  }
}

FieldExtension.propTypes = {
  sdk: PropTypes.object.isRequired
}
