import React from 'react'
import { TextInput, Textarea, Card } from '@contentful/forma-36-react-components'
import { EditorExtensionSDK } from 'contentful-ui-extensions-sdk'

interface Props {
  sdk: EditorExtensionSDK
}

interface State {
  title: string
  body: string
  titleIsDisabled: boolean
  bodyIsDisabled: boolean
}

export class EntryEditorExtension extends React.Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      title: props.sdk.entry.fields.title.getValue() || '',
      body: props.sdk.entry.fields.body.getValue() || '',
      titleIsDisabled: true,
      bodyIsDisabled: true
    }
  }

  componentDidMount() {
    const fields = this.props.sdk.entry.fields

    fields.title.onValueChanged(value => {
      this.setState({ title: value })
    })
    fields.body.onValueChanged(value => {
      this.setState({ body: value })
    })
    fields.title.onIsDisabledChanged(value => {
      this.setState({ titleIsDisabled: value !== false })
    })
    fields.body.onIsDisabledChanged(value => {
      this.setState({ bodyIsDisabled: value !== false })
    })
  }

  onTitleChange = e => {
    const value = e.target.value || ''
    this.setState({ title: value })

    if (value) {
      this.props.sdk.entry.fields.title.setValue(value)
    } else {
      this.props.sdk.entry.fields.title.removeValue()
    }
  }

  onBodyChange = e => {
    const value = e.target.value || ''
    this.setState({ body: value })

    if (value) {
      this.props.sdk.entry.fields.body.setValue(value)
    } else {
      this.props.sdk.entry.fields.body.removeValue()
    }
  }

  render() {
    return (
      <>
        <Card className="f36-margin--xl">
          <TextInput
            className="f36-margin-bottom--xl"
            testId="title-field"
            width="large"
            type="text"
            id="my-title"
            value={this.state.title}
            disabled={this.state.titleIsDisabled}
            onChange={this.onTitleChange}
          />
          <Textarea
            testId="body-field"
            width="large"
            id="my-body"
            value={this.state.body}
            disabled={this.state.bodyIsDisabled}
            onChange={this.onBodyChange}
          />
        </Card>
      </>
    )
  }
}
