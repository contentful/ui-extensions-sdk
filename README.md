# Contentful UI Extensions SDK

The UI Extensions SDK allows you to customize and extend the functionality of [Contentful](https://www.contentful.com)
Web Application's entry editor. The editor itself is a container for many components that enable editors to manipulate the content stored in content fields. Extensions can be simple user interface controls, such as a dropdown, or more complex micro web applications such as our Markdown editor. They are decoupled entities from field types, and can be reused (for example using a dropdown to edit number or text fields).

Previously, the Contentful Web Application only offered our core platform components to manipulate fields' content. Now, with the UI Extensions SDK it is possible to personalize this Web App based on your needs.
Core components and custom extensions are both built on top of the same API, leading them to follow the same approach. The main difference resides in the fact that custom extensions are rendered inside a secure iframe. The next step in our roadmap is to open source our core components to extend them or give more insights on how to build custom extensions.

Every Contentful user has access to this feature, it is enabled by default, and all requirements to start using it are simply to follow the instructions contained here.

This SDK overview introduces you to the concept of custom extensions and lists concrete
usage examples. The [extension API documentation][api-ref], on the other hand, provides in-depth information on what the API exposes to the consumer.

You can also refer to the [following FAQ](FAQ.md) for questions related to hosting, or limitations.

## Getting started

The most convenient way to upload and manage extensions through our API is via the
[`contentful`][contentful-cli] command line tool. You can install it with

```bash
npm install -g contentful-cli
```

Including the compiled version of the extension client library is as simple as
adding the following line to your application.

~~~html
<script src="https://unpkg.com/contentful-ui-extensions-sdk@3"></script>
~~~

It also provide a set of examples you can check out to get a deeper understanding of the SDK capabilities.

To get an overview over the API, have a look at the [reference documentation][api-ref]

[contentful-cli]: https://www.npmjs.com/package/contentful-cli
[api-ref]: docs/ui-extensions-sdk-frontend.md


## Extensions taxonomy and example use cases

Conceptually, there are two main categories of custom extensions, for content
editing and content management.
- Content editing extensions reside in the entry editor body and operate on top of a particular field or set of fields.
- Management extensions perform actions on the entire entry.

### Content editing extensions
Content editing extensions can operate on either single fields, or multiple fields.

#### Single field extensions
Content editing extensions applied to single fields are great for circumstances
where you just want to customize how you edit a particular field type. Examples
of single field extensions are:

* Integration with external digital asset management system (i.e. flickr) to
  insert external assets
* Specific data manipulation, like removing an element ID for a social media
  link
* Integration with a translation API service to programmatically translate the
  field's content
* Creation or integration with custom text editing interface

#### Multiple field extensions
If you need more than a single field, you can try multi-field level extensions.
Currently we have two approaches for this:

##### Using JSON objects
The first is a simple approach is to use a JSON object field type and construct
any complex field type that is not provided out of the box by Contentful, along
with its UI and logic. However, there is a tradeoff when using this approach.
Data inside of a JSON field cannot be used to query or filter entries in our
APIs.

##### Using relationships between multiple fields
This approach involves creating a single field custom extension that can use our
CMA to perform operations on other fields within the entry.
Examples of multi-field-level extensions are:

* Automatic asset metadata creation: When inserting an asset on a media field I
  want the long-text field below it to query our copyright database and fill-in
  the details for the asset above
* Custom recipes: When selecting an item from a dropdown menu I want the content
  of a short-text field type to change

### Content management extensions

Content management extensions reside on the sidebar and allow for actions that
include every element in the entry. These are better suited for tasks related to
workflows, data-management, integrations, etc.
Examples of entry-level extensions are:

* Custom webhooks/notifications
* Integration with a preview environment
* Moving entries across different spaces

## Using Contentful styles

As extensions are rendered inside an iframe, you will need to include the
`cf-extension.css` library within your custom extension in order to use any of
Contentful's styles.

You can include this CSS in your extension code as follows:

```html
<link rel="stylesheet" type="text/css" href="https://unpkg.com/contentful-ui-extensions-sdk@3/dist/cf-extension.css">
```

Futher information about styling your extension can be found in the
[styleguide](http://contentful.github.io/ui-extensions-sdk/styleguide).

## Providing feedback

Technical feedback can be provided directly through the Github repo. However, if at any point some confidential or business sensitive information needs to be discussed, then the conversation should be handled via our formal support channels.
