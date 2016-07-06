# Contentful UI Extensions SDK

The UI Extensions SDK allows you to customize and extend the functionality of [Contentful](https://www.contentful.com)
Web Application's entry editor. The editor itself is a container for many components that enable editors to manipulate the content stored in content fields. Extensions can be simple user interface controls, such as a dropdown, or more complex micro web applications such as our Markdown editor. They are decoupled entities from field types, and can be reused (for example using a dropdown to edit number or text fields).

Previously, the Contentful Web Application only offered our core platform components to manipulate fields' content. Now, with the UI Extensions SDK it is possible to personalize this Web App based on your needs.
Core components and custom extensions are both built on top of the same API, leading them to follow the same approach. The main difference resides in the fact that custom extensions are rendered inside a secure iframe. The next step in our roadmap is to open source our core components to extend them or give more insights on how to build custom extensions.

Every Contentful user has access to this feature, it is enabled by default, and all requirements to start using it are simply to follow the instructions contained here.

This SDK overview introduces you to the concept of custom extensions and lists concrete
usage examples. The [extension API documentation][api-ref], on the other hand, provides in-depth information on what the API exposes to the consumer.

You can also refer to the [following FAQ][FAQ.md] for questions related to hosting, or limitations.

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

## Getting started

The most convenient way to upload and manage extensions through our API is via the
[`contentful-extension`][cf-extension-cli] command line tool. You can install it with

```bash
npm install -g contentful-extension-cli
```

Including the compiled version of the extension client library is as simple as
adding the following line to your application.

```html
<script src="https://contentful.github.io/ui-extensions-sdk/cf-extension-api.js"></script>
```

Note that you also can use our skeleton and start building your extension by cloning our [bundles repository]():

```bash
git clone https://github.com/contentful/bundles.git
cd bundles/extensions/skeleton
```

It also provide a set of examples you can check out to get a deeper understanding of the SDK capabilities.

To get an overview over the API, have a look at the [reference documentation][api-ref]

[cf-extension-cli]: https://github.com/contentful/contentful-extension-cli
[api-ref]: doc/ui-extensions-sdk-frontend.md


## Using Contentful styles

As extensions are rendered inside an iframe, you will need to include the
`cf-extension.css` library within your custom extension in order to use any of
Contentful's styles.

You can include this CSS in your extension code as follows:

```html
<link rel="stylesheet" type="text/css" href="https://contentful.github.io/ui-extensions-sdk/cf-extension.css">
```

Futher information about styling your extension can be found in the
[styleguide](http://contentful.github.io/ui-extensions-sdk/styleguide).


## Examples

Our bundles repository includes the following example extension implementations. Before you can
use them, you need to run `npm install` in the repository root.

#### [Basic Rating Dropdown](https://github.com/contentful/extensions/tree/master/samples/rating-dropdown)

![rating-dropdown](http://contentful.github.io/ui-extensions-sdk/assets/rating-dropdown.png)

This example is a basic extension meant to help you *get started* with custom extensions development. Uses a dropdown to
change the value of a number field and makes some CMA requests.

#### [Rich Text Editor](https://github.com/contentful/extensions/tree/master/samples/alloy-editor)

![alloy-editor](http://contentful.github.io/ui-extensions-sdk/assets/alloy-editor.png)

This example integrates the [Alloy rich-text/HTML editor](http://alloyeditor.com/) to
edit “Text” fields. Great to personalize the entry editor and enable HTML editing as an alternative to Markdown.

#### [Slug Generator](https://github.com/contentful/extensions/tree/master/samples/slug)

![slug-extension](http://contentful.github.io/ui-extensions-sdk/assets/slug-widget.png)

This example will automatically generate its value from an entry's title field.
For example typing “Hello World” into the title field will set the extensions input
field to “hello-world”. It will also check the uniquness of the slug across a
customizable list of content types. It highlights how the extensions SDK can be used to *inspect any value*
of an entry and *react to changes*.

#### [JSON Editor](https://github.com/contentful/extensions/tree/master/samples/json-editor)

![json-editor-ok](http://contentful.github.io/ui-extensions-sdk/assets/json-editor.png)

This example provides a JSON formatter and validator based on the [Codemirror](http://codemirror.net) library. It should be used with fields with the type “Object”.

#### [JSON Form Editor](https://github.com/contentful/extensions/tree/master/samples/json-form-editor)

![json-form-editor](http://contentful.github.io/ui-extensions-sdk/assets/json-form-editor.png)

This example integrates the [JSON Editor](https://github.com/jdorn/json-editor)
library to display an edit form based on a predefined [JSON Schema](https://json-schema.org/).
Form input gets stored as a JSON object.

#### [Translator](https://github.com/contentful/extensions/tree/master/samples/translate)

![translate-extension](http://contentful.github.io/ui-extensions-sdk/assets/translate-widget.png)

This example translates text from the default locale to other locales in a space using the Yandex translation API.

#### [Wistia Videos](https://github.com/contentful/extensions/tree/master/samples/wistia)

![Screenshot of Wistia extension](http://contentful.github.io/ui-extensions-sdk/assets/wistia.gif)

This example loads videos from a [project](http://wistia.com/doc/projects) on [wistia](http://wistia.com/) into the Contentful Web Application. A video can be easily previewed, selected and then stored as part of your content. In this example extension we store the video embed URL in Contentful so the video can be embedded easily.

#### [YouTube ID](https://github.com/contentful/extensions/tree/master/samples/youtube-id)

![youtube-id](http://contentful.github.io/ui-extensions-sdk/assets/youtube-id.png)

This example extracts the video id from a valid YouTube URI. Useful as a simple way to integrate with 3rd party media services.

#### [Diffing Published and Draft](https://github.com/contentful/extensions/tree/master/samples/examples/diff)

![Screenshot of diff extension](http://contentful.github.io/ui-extensions-sdk/assets/diff-extension.png)

The diff editor extension shows the diff between the draft value and the published value of a short text field.

#### [Chessboard](https://github.com/contentful/extensions/tree/master/samples/chessboard)

![Chessboard extension in action](http://contentful.github.io/ui-extensions-sdk/assets/chessboard.gif)

This example displays a chessboard and stores the board position as a JSON
object. You can drag pieces on the chessboard and the position data will be
updated automatically. The extension also supports *collaborative editing*. If two
editors open the same entry moves will be synced between them. It highlights the flexibility and potential of solutions that can be built using the UI Extensions SDK.

## Providing feedback

Technical feedback can be provided directly through the Github repo. However, if at any point some confidential or business sensitive information needs to be discussed, then the conversation should be handled via our formal support channels.
