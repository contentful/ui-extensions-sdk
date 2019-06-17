import React from 'react'
import { render } from 'react-dom'
import PropTypes from 'prop-types'
import { TextInput } from '@contentful/forma-36-react-components'
import { init } from 'contentful-ui-extensions-sdk'
import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'

class App extends React.Component {
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
    // const test = this.props.sdk.navigator.openPageExtension('test')
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
      <TextInput
        width="large"
        type="text"
        id="my-field"
        value={this.state.value}
        onChange={this.onChange}
      />
    )
  }
}

App.propTypes = {
  sdk: PropTypes.object.isRequired
}

init(sdk => {
  render(<App sdk={sdk} />, document.getElementById('root'))
})
