# Contentful Widget SDK

The custom widgets API allows you to personalize the Contentful Web
Application's entry editor, so that you can build plugins that meet your
specific content editing or content management needs. It operates on top of any
of our current field types, and gives you the power to manipulate its data
through an iframe where you can embed custom functionality, styling,
integrations or workflows.

### Usage

[Download the library](api-download) and include it in your HTML.

```html
<script src="cf-widget-api.js"></script>
```

Alternatively, you can [build it yourself](#buildyourself).

[api-download]: https://contentful.github.io/widget-sdk/cf-widget-api.js


### <a name="buildyourself"></a>Build it yourself

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


### Examples

#### Flickr widget
* Run `npm install` && `npm start`
* This will transpile the required files and start a server on `http://localhost:9011`
* This example uses the `src` property - the widget files are hosted on an external server


#### Json Editor widget
* Run `npm install` && `gulp`
* This will install and inline all of the dependencies to the `index.html` file in the `/out` directory
* This example uses the `srcdoc` property - the widget source file is hosted on Contentful

#### Translate widget

* Run `npm install` && `gulp`
* This will install and inline all of the dependencies to the `index.html` file in the `/out` directory
* This example uses the `srcdoc` property - the widget source file is hosted on Contentful
