# Extension Management API Reference

This document describes the [Content Management API](http://docs.contentfulcma.apiary.io)'s
endpoints which allow to manage custom Extensions in [Contentful](https://www.contentful.com).
The API allows to create, update, delete and read custom extensions.

The API documented here is utilized by the [`contentful-extension`][cf-extension-cli]
command line tool which offers a more convenient way to manage extensions than using
the API directly. The extension API documentation for actual extension development can be
found [here](/doc/ui-extensions-sdk-frontend.md).

[cf-extension-cli]: https://github.com/contentful/contentful-extension-cli


## API

### Endpoints
Path                   | Method | Payload       | Description | Notes
-----------------------|--------|---------------|-------------|------
spaces/XYZ/extensions     | GET    | None          | Returns the extensions for the space. | The returned payload will have the same structure as other collections
spaces/XYZ/extensions     | POST   | A json object |Creates a extension
spaces/XYZ/extensions/ABC | PUT    | A json object | If the extension with ID ABC doesn't already exists it will be created with that ID. If the extension already exists the payload will replace the current extension with that ID.
spaces/XYZ/extensions/ABC | DELETE | None          | Deletes the extension with ID ABC
spaces/XYZ/extensions/ABC | GET    | None          | Returns the extension with ID ABC

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
 
#### Extension schema
A extension is a JSON object with at least the following properties. For the prototype the endpoint should accept and store any additional properties

Name | Type | Description
-----|------|------------
src | String |	Should be a URL that points to the HTML document displayed in
srcdoc | String | An HTML document serialized as a string. This will be theset as the srcdoc attribute on the extension IFrame.
fieldTypes | Array of strings	 | Field Types the extension can be used
name | String | The string that is displayed when selecting the extension in the CT Editor

#### Access Control
For the prototype we consider the following access control rules:

- Only the developer role must be able to create and update a extension resource.
- Every user who has access to a space can read all extensions
