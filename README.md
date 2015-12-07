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

Basic widget that helps you *get started* with developing. Uses a dropdown to
change the value of a number field and makes some CMA requests.

#### [Chessboard](examples/chessboard)

This widget displays a chessboard and stores the board position as a JSON
object. You can drag pieces on the chessboard and the position data will be
updated automatically. The widget also supports *collaborative editing*. If two
editors open the same entry moves will be synced between them.

#### [Slug Generator](examples/slug)

This widget will automatically generate its values from an entries title field.
For example typing “Hello World” into the title field will set the widgets input
field to “hello-world”. It will also check the uniquness of the slug across a
customizable list of content types.

This examples highlights how the widget API can be used to *inspect any value*
of an entry and *react to changes*.

#### [Rich Text Editor](examples/alloy-editor)

This example integrates the [Alloy rich text editor](http://alloyeditor.com/) to
edit “Text” fields.

#### Json Editor widget
* Run `npm install && gulp`
* This will install and inline all of the dependencies to the `index.html` file in the `/dist` directory
* This example uses the `srcdoc` property - the widget source file is hosted on Contentful

#### Translate widget

* Run `npm install && gulp`
* This will install and inline all of the dependencies to the `index.html` file in the `/dist` directory
* This example uses the `srcdoc` property - the widget source file is hosted on Contentful
