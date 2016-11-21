# Change Log

All notable changes to this project will be documented in this file. This
project adheres to [Semantic Versioning](http://semver.org/) and the ["Keep a
Changelog" format](http://keepachangelog.com/).

## 3.1.0 - 2016-11-21

### Added

This version introduces new functionality:

- `extension.dialogs.select...(options)` opens a dialog for selecting entries
and assets

You can now open the native entity selection dialog window from your extension.
An `options` object passed to the call allows you to configure the behavior of
search and insertion. [Please see the API reference](https://github.com/contentful/ui-extensions-sdk/blob/master/docs/ui-extensions-sdk-frontend.md) for more details.

## 3.0.0 - 2016-10-19

This version introduces a breaking change:

- `field.setValue()` calls `field.onValueChanged()` handlers

You will need to migrate if one of your `onValueChanged` handles triggers a call
to `setValue()` to prevent infinite loops. In that case you should compare the
value received by the change handler to your internal representation. You should
avoid triggering an update when the values are equal.

## 2.1.0 - 2016-09-13

### Added

- `field.validations` property.
- `field.onSchemaErrorsChanged` signal.

## 2.0.1 - 2016-07-13

### Fixed

- Use `dist/cf-extension-api.js` file as the module's entry point

## 2.0.0 - 2016-07-06

- Deprecate "widget" in favour of "extension"
- `contentful-widget-sdk` package on NPM is deprecated in favour of
`contentful-ui-extensions-sdk`
- Global exposed on `window` is now called `contentfulExtension` instead of
`contentfulWidget`
- `widget.json` is now called `extension.json`
- SDK assets hosted by us are now renamed as below

  - `cf-widget-api.js` is now called `cf-extension-api.js`
  - `cf-widget-api.css` is now called `cf-extension.css`

## 1.0.0 - 2016-06-22

### Added

- Expose `widget.contentType` that contains name of content type used, data on
all the fields in the entry, current display field and sys data.
- Expose `widget.space.getPublishedEntries` and
`widget.space.getPublishedAssets`. These methods also let you filter by
asset/entry.
- Expose `widget.field.removeValue` which can be used to remove the value for a
field from the data model.
- Expose `widget.field.onIsDisabledChanged`. It takes a callback which is fired
when the disabled status of the field changes.
- Expose `widget.field.setInvalid`. It can be used to communicate validation
status of the field to the Contentful web application.
- Expose `widget.field.type`
- Expose `widget.entry.field[id].onIsDisabledChanged(locale, handler)`

### Changed

- Field focus/blur status is communicated internally to the Contentful web
application for the styles to work correctly.

### Fixed

- Fix `widget.field.onValueChanged` firing on the client that called
`field.setValue()`.

## 0.1.1 - 2015-02-23

### Fixed

- Ensure compatibility with Contentful Content Management App deployed at the
same day.
- Fix example widgets `widget.json`s `src` localhost urls to
be`contentful-widget` cli compatible.

## 0.1.0 - 2015-02-16

Initial release
