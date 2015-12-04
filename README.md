# Contentful Widget SDK

The custom widgets API allows you to personalize the Contentful Web
Application's entry editor, so that you can build plugins that meet your
specific content editing or content management needs. It operates on top of any
of our current field types, and gives you the power to manipulate its data
through an iframe where you can embed custom functionality, styling,
integrations or workflows.

## Getting Started

To upload and manage widgets on our API you will need the
`contenful-widget` command line tool. You can install it with:
~~~bash
npm install -g contentful/contentful-widget-cli
~~~

If you want to learn how to write your own widgets and see them in
action, checkout the documentation for the
[Number Dropdown Widget](./examples/number-dropdown)

## Usage

[Download the library][api-download] and include it in your HTML.


Alternatively, you can [build it yourself](#build-it-yourself).

[api-download]: https://contentful.github.io/widget-sdk/cf-widget-api.js


## Using Contentful Styles

As widgets are rendered inside an iframe, you will need to include the `cf-widget-api.css` library within your custom widget in order to use any of Contentful's styles.

Download the CSS library [here](https://contentful.github.io/widget-sdk/cf-widget-api.css) and include it in your widget

```html
<link rel="stylesheet" type="text/css" href="cf-widget-api.css">
```

Futher information can be found in the [styleguide](http://contentful.github.io/widget-sdk/styleguide).


## Build it yourself

To run the Contentful Widget SDK you need:

* 0.12.7 or newer
* npm 2.11.3 or newer

Clone the repository:

```bash
git clone https://github.com/contentful/widget-sdk.git
```

Navigate to directory and run build script

```bash
cd widget-sdk && make
```

The compiled version of the Contentful Widget SDK and map file will be available
in the `dist` folder.


## Examples

#### [Basic Number dropdown](examples/number-dropdown)

Basic widget that helps you get started with developing. Uses a
dropdown to change the value of a number field and makes some CMA
requests.
