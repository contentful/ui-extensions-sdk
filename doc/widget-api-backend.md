# Widget Management API Reference

This document describes the [Content Management API](http://docs.contentfulcma.apiary.io)'s
endpoints which allow to manage custom Widgets in [Contentful](https://www.contentful.com).
The API allows to create, update, delete and read custom widgets.

The API documented here is utilized by the [`contentful-widget`][cf-widget-cli]
command line tool which offers a more convenient way to manage widgets than using
the API directly. The widget API documentation for actual widget development can be
found [here](/doc/widget-api-frontend.md).

[cf-widget-cli]: https://github.com/contentful/contentful-widget-cli


## API

### Endpoints
Path                   | Method | Payload       | Description | Notes
-----------------------|--------|---------------|-------------|------
spaces/XYZ/widgets     | GET    | None          | Returns the widgets for the space. | The returned payload will have the same structure as other collections
spaces/XYZ/widgets     | POST   | A json object |Creates a widget
spaces/XYZ/widgets/ABC | PUT    | A json object | If the widget with ID ABC doesn't already exists it will be created with that ID. If the widget already exists the payload will replace the current widget with that ID.
spaces/XYZ/widgets/ABC | DELETE | None          | Deletes the widget with ID ABC
spaces/XYZ/widgets/ABC | GET    | None          | Returns the widget with ID ABC

#### Restrictions
For the prototype there should be no limitations to the data apart of those enforced by the storage mechanism. We might want to rethink this after we evaluated performance, requirements, and upsell needs.

#### Validation
For now it suffices to assure that the payload is a JSON document. In the future we will have the following validations:

Name | Type | Required | Validation
-----|------|----------|-----------
src | String |	❌ (yes if no srcdoc given) 
srcdoc |	String |	❌ (yes if no src given)
fieldTypes | Array of strings | ❌ | Every element must be one of the strings Symbol, Symbols, Text, Integer, Number, Date, Boolean, Object, Entry, Entries, Asset, Assets
name | String | ✓
 
#### Widget schema
A widget is a JSON object with at least the following properties. For the prototype the endpoint should accept and store any additional properties

Name | Type | Description
-----|------|------------
src | String |	Should be a URL that points to the HTML document displayed in
srcdoc | String | An HTML document serialized as a string. This will be theset as the srcdoc attribute on the widget IFrame.
fieldTypes | Array of strings	 | Field Types the widget can be used
name | String | The string that is displayed when selecting the widget in the CT Editor

#### Access Control
For the prototype we consider the following access control rules:

- Only the developer role must be able to create and update a widget resource.
- Every user who has access to a space can read all widgets
