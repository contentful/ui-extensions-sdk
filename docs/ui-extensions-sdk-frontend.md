# UI Extensions API Reference

This document describes the API that a custom extension can use to
communicate with the Contentful Management App.

### Table of Contents
* [Inclusion into your project](#inclusion-into-your-project)
* [Initialization](#initialization)
* [`extension.contentType`](#extensioncontenttype)
* [`extension.field`](#extensionfield)
* [`extension.entry`](#extensionentry)
  * [`entry.fields[id]`](#entryfieldsid-field)
* [`extension.space`](#extensionspace)
  * [Content Types](#content-types)
  * [Entries](#entries)
  * [Assets](#assets)
* [`extension.locales`](#extensionlocales)
* [`extension.window`](#extensionwindow)

## Inclusion into your project

You will need to include the `contentful-extension-sdk` library in your HTML5 app like
so:
~~~html
<script src="https://unpkg.com/contentful-ui-extensions-sdk@2"></script>
~~~

The SDK is also distributed as an [NPM package][package].
~~~bash
npm install --save contentful-ui-extensions-sdk
~~~

You can include it in your code base with
~~~js
var contentfulExtension = require('contentful-ui-extensions-sdk')
~~~

[package]: https://www.npmjs.com/package/contentful-ui-extensions-sdk

## Initialization

The SDK exposes the `contentfulExtension.init()` method.
This is the main entry point for all extension related code. If you require the
script from the web without any module system the entry point is available as

~~~js
window.contentfulExtension.init(function (extension) {
  var value = extension.field.getValue()
  extension.field.setValue("Hello world!")
})
~~~

If you use a CommonJS packager for the browser (e.g. [Browserify][]) you need
to require the Extensions SDK.

~~~js
var contentfulExtension = require('contentful-ui-extensions-sdk')
contentfulExtension.init(function (extension) {
  /* ... */
})
~~~

[Browserify]: http://browserify.org/

## `extension.contentType`

This API gives you access to data about the content type and the entry.
It has the shape as described under "content type properties" in our
[api documentation](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/content-types).

_Since 1.0.0_

## `extension.field`

This API gives you access to the value and metadata of the field the extension is
attached to.

If you use localization, a extension instance will be rendered for each locale.
This means you can only change the value for the given locale. See the
[`entry.fields` API](#entryfieldsid-field) on how to change values for different
locales.

Suppose an entry returned by the Contentful Management API looks like this
~~~js
{
  sys: { ... },
  fields: {
    title: {
      "en_US": "My Post"
    },
    ...
  }
}
~~~
and the extension is attached to the `title` field and the `en_US` locale.


##### `extension.field.getValue(): mixed`
Gets the current value of the field and locale. In the example this would yield `"My Post"`.

##### `extension.field.setValue(value): Promise<void>`
Sets the value for the field and locale. The promise is resolved when the change
has been acknowledged. The type of the value must match the expected field type.
For example, if the extension is attached to a “Symbol” field you must pass a
string.

##### `extension.field.removeValue(value): Promise<void>`
Removes the value for the field and locale. A subsequent call to `getValue()` for the field would yield `undefined`.

##### `extension.field.setInvalid(Boolean): undefined`
Communicates to the Contentful web application if the field is in a valid state or not.
This impacts the styling applied to the field container.

##### `extension.field.onValueChanged(cb): function`
Calls the callback every time the value of the field is changed by some external
event (e.g. when multiple editors are working on the same entry) or when
`setValue()` is called

The method returns a function that can be called to stop listening to changes.

_Changed in v3.0.0_

##### `extension.field.onIsDisabledChanged(cb): function`
Calls the callback when the disabled status of the field changes.
A boolean indicating whether the field is disabled or not is passed to the callback.

The method returns a function that can be called to stop listerning to changes.

##### `extension.field.onSchemaErrorsChanged(cb): function`
Calls the callback immediately with the current validation errors and whenever
the field is revalidated. The callback receives an array of error objects. An empty array indicates no errors.

The errors are updated when the app validates an entry. This happens when
loading an entry or when the user tries to publish it.

The method returns a function that can be called to stop listerning to changes.

_Since v2.1.0_

##### `extension.field.id: string`
The ID of a field is defined in an entry’s content type. Yields `"title"` in the
example.

##### `extension.field.locale: string`
The current locale of a field the extension is attached to. Yields `"en_US"` in the
example.

##### `extension.field.type: string`
Holds the type of the field the extension is attached to.
The field type can be one of the many described
[in our api documentation](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/content-types).

##### `extension.field.validations: Validation[]`
A list of validations for this field that are defined in the content type. The
[content type documentation](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/content-types/content-type/create/update-a-content-type)
provides more information on the shape of validations.

_Since v2.1.0_

## `extension.entry`
This object allows you to read and update the value of any field of the current
entry and to get the entry's metadata.

##### `entry.getSys(): object`
Returns metadata for an entry. The value coincides with the `sys` value of an
entry returned by the `v0.8.x` of the
[Contentful Management API](https://github.com/contentful/contentful-management.js/tree/legacy#entry-properties).

##### `entry.onSysChanged(cb): function`
Calls the callback with metadata every time that metadata changes. The returned
function can be called to stop listening to changes.

### `entry.fields[id]: Field`

In addition to [`extension.field`](#extensionfield), a extension can also control the
values of all other fields in the current entry. Fields are referenced by their ID.

The `Field` API methods provide a similar interface to `extension.field`. In
addition, the methods accept an optional locale to change the value for a
specific locale. It defaults to the space the space’s default locale (see
[`extension.locales`](#extensionlocales)). Providing an unknown locale throws an
exception.

* `field.id: string`
* `field.locales: Array<string>`
* `field.getValue(locale?): mixed`
* `field.setValue(value, locale?): Promise<void>`
* `field.removeValue(locale?): Promise<void>`
* `field.onValueChanged(locale?, cb): function`
* `field.onIsDisabledChanged(locale?, cb): function`

#### Example
If the entry has a “title” field, we can transform it to upper case with
~~~js
var titleField = extension.entry.fields.title
var oldTitle = titleField.getValue()
titleField.setValue(oldTitle.toUpperCase())
~~~


## `extension.space`

The `space` object exposes methods that allow the extension to read and manipulate a
wide range of objects in the space. Its API mirrors `v0.8.x` of the
[`contentful-management` library][cma-js], with a few differences.

[cma-js]: https://github.com/contentful/contentful-management.js/tree/legacy

### Content Types

Allows operating on the current space's content types. Content types
created/updated or deleted this way will immediately be published or unpublished
respectively.

* `space.getContentType(id)`
* `space.getContentTypes()`
* `space.createContentType(data)`
* `space.updateContentType(data)`
* `space.deleteContentType(data)`

### Entries

* `space.getEntry(id)`
* `space.getEntries(query)`
* `space.createEntry(data)` The content type is expected in `data.sys.contentType`
* `space.updateEntry(data)`
* `space.publishEntry(data)`
* `space.unpublishEntry(data)`
* `space.archiveEntry(data)`
* `space.unarchiveEntry(data)`
* `space.deleteEntry(data)`
* `space.getPublishedEntries(query)`

### Assets

Same as the entry's method with “Entry” replaced by “Asset”. In addition there
is `space.processAssetFile(asset, locale)`


## `extension.locales`

A space can have multiple locales and each localized entry field can have
different values for different locales. Locales are identified by their locale
code, e.g. `"en_US"`.

##### `locales.default: string`
The default locale for the current space.

##### `locales.available: Array<string>`
A list of all locales available in the current space.


## `extension.window`

The window object provides methods to update the size of iframe the extension is
contained in. This prevents scrollbars inside the extension.

To prevent a flickering scrollbar during height updates, it is recommended to
set the extension's `body` to `overflow: hidden;`.

##### `window.updateHeight()`
Calculates the body’s `scrollHeight` and sets the containers height to
this value.

##### `window.updateHeight(height)`
Sets the iframe height to the given value in pixels. `height` must be an integer.

##### `window.startAutoResizer()`
Listens for DOM changes and calls `updateHeight()` when the size changes.

##### `window.stopAutoResizer()`
Stops resizing the iframe automatically.
