# Contentful Widget SDK

The custom widgets API allows you to personalize the Contentful Web
Application's entry editor, so that you can build plugins that meet your
specific content editing or content management needs. It operates on top of any
of our current field types, and gives you the power to manipulate its data
through an iframe where you can embed custom functionality, styling,
integrations or workflows.

## Getting Started

The most convenient way to upload and manage widgets through our API is
via the `contenful-widget` command line tool.  You can install it from
this repository with `npm install -g .` or from github
~~~bash
npm install -g "git+ssh@github.com:contentful/widget-sdk.git"
~~~

If you want to learn how to write your own widgets and see them in
action, checkout the documentation for the
[Number Dropdown Widget](./examples/number-dropdown)

## Usage

[Download the library][api-download] and include it in your HTML.

```html
<script src="cf-widget-api.js"></script>
```

Alternatively, you can [build it yourself](#build-it-yourself).

[api-download]: https://contentful.github.io/widget-sdk/cf-widget-api.js


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

#### Json Editor widget
* Run `npm install && gulp`
* This will install and inline all of the dependencies to the `index.html` file in the `/dist` directory
* This example uses the `srcdoc` property - the widget source file is hosted on Contentful

#### Translate widget

* Run `npm install && gulp`
* This will install and inline all of the dependencies to the `index.html` file in the `/dist` directory
* This example uses the `srcdoc` property - the widget source file is hosted on Contentful
