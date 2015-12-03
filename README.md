# Contentful Widget SDK

The custom widgets API allows you to personalize the Contentful Web
Application's entry editor, so that you can build plugins that meet your
specific content editing or content management needs. It operates on top of any
of our current field types, and gives you the power to manipulate its data
through an iframe where you can embed custom functionality, styling,
integrations or workflows.

## Getting Started

The most convenient way to upload and manage widgets through our API is via the
[`contenful-widget`][cf-widget-cli] command line tool. You can install it with

```bash
npm install -g "git+ssh@github.com:contentful/widget-sdk-cli.git"
```

If you want to learn how to write your own widgets and see them in
action, checkout the documentation for the
[Number Dropdown Widget](./examples/number-dropdown)

[cf-widget-cli]: https://github.com/contentful/contentful-widget-cli

## Usage

This repository contains a [command line tool](lib/cli) to manage widgets
through the Contentful API and the [widget client library](doc/widget-api-frontend.md)
that widget developers need to include in their implementation.

The cli tool can be installed by running `npm install -g`. Including the
compiled version of the widget client library is as simple as adding the
following line to your application.

```html
<script src="https://contentful.github.io/widget-sdk/cf-widget-api.js"></script>
```

*As of now we do not distribute this repository through npm.*


## Examples

#### [Basic Number dropdown](examples/number-dropdown)

Basic widget that helps you get started with developing. Uses a
dropdown to change the value of a number field and makes some CMA
requests.
