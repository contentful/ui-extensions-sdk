# Contentful UI Extensions SDK

The UI Extensions SDK allows you to customize and extend the functionality of [Contentful](https://www.contentful.com)
Web Application's entry editor. The editor itself is a container for many "widgets" that enable editors to manipulate the content stored in content fields. Widgets' complexity varies. They can be simple user interface controls, such as a dropdown, or more complex micro web applications such as our Markdown editor. They are decoupled entities from field types, and can be reused (for example using a dropdown widget to edit number or text fields).

Previously, the Contentful Web Application only offered our core platform widgets as options to manipulate fields' content. Now, with the UI Extensions SDK it is possible to create custom widgets to further personalize your users' needs.
Core widgets and custom widgets are both built on top of the same API, making them virtually identical in functionality with the main difference being that custom widgets are rendered inside a secure iframe. The next step in our roadmap is to open source our core widgets to make it even easier to build custom ones.

Every Contentful user has access to this feature, it is enabled by default, and all requirements to start using it are simply to follow the instructions contained here.

This SDK overview introduces you to the concept of custom widgets and lists concrete
usage examples. The actual [widget API documentation][api-ref]
on the other hand gives you a more abstract and technical overview.

## Widgets taxonomy and example use cases

Conceptually, there are two main categories of custom widgets, for content
editing and content management. Editing widgets reside on the main body of the
entry editor and operate on top of a particular field or set of fields, while
the management widgets perform actions on the entire entry.

### Content editing widgets
Content editing widgets can operate on either single fields, or multiple fields.

#### Single field widgets
Content editing widgets applied to single fields are great for circumstances
where you just want to customize how you edit a particular field type. Examples
of single field widgets are:

* Integration with external digital asset management system (i.e. flickr) to
  insert external assets
* Specific data manipulation, like removing an element ID for a social media
  link
* Integration with a translation API service to programmatically translate the
  field's content
* Creation or integration with custom text editing interface

#### Multiple field widgets
If you need more than a single field, you can try multi-field level widgets.
Currently we have two approaches for this:

##### Using JSON objects
The first is a simple approach is to use a JSON object field type and construct
any complex field type that is not provided out of the box by Contentful, along
with its UI and logic. However, there is a tradeoff when using this approach.
Data inside of a JSON field cannot be used to query or filter entries in our
APIs.

##### Using relationships between multiple fields
This approach involves creating a single field custom widget that can use our
CMA to perform operations on other fields within the entry.
Examples of multi-field-level widgets are:

* Automatic asset metadata creation: When inserting an asset on a media field I
  want the long-text field below it to query our copyright database and fill-in
  the details for the asset above
* Custom recipes: When selecting an item from a dropdown menu I want the content
  of a short-text field type to change

### Content management widgets

Content management widgets reside on the sidebar and allow for actions that
include every element in the entry. These are better suited for tasks related to
workflows, data-management, integrations, etc.
Examples of entry-level widgets are:

* Custom webhooks/notifications
* Integration with a preview environment
* Moving entries across different spaces

## Getting started

The most convenient way to upload and manage widgets through our API is via the
[`contentful-widget`][cf-widget-cli] command line tool. You can install it with

```bash
npm install -g contentful-widget-cli
```

To work with the widget sdk library and the examples, clone this repo and install the dependencies:

```bash
git clone https://github.com/contentful/ui-extensions-sdk.git
cd ui-extensions-sdk
npm install
```

Including the compiled version of the widget client library is as simple as
adding the following line to your application.

```html
<script src="https://contentful.github.io/ui-extensions-sdk/cf-widget-api.js"></script>
```

If you want to learn how to write your own widgets and see them in
action, checkout the documentation for the
[Rating Dropdown Widget](./examples/rating-dropdown). To get an overview over
the API have a look at the [reference documentation][api-ref]

[cf-widget-cli]: https://github.com/contentful/contentful-widget-cli
[api-ref]: doc/widget-api-frontend.md


## Using Contentful styles

As widgets are rendered inside an iframe, you will need to include the
`cf-widget-api.css` library within your custom widget in order to use any of
Contentful's styles.

Download the CSS library [here](https://contentful.github.io/ui-extensions-sdk/cf-widget-api.css) and include it in your widget

```html
<link rel="stylesheet" type="text/css" href="cf-widget-api.css">
```

Futher information can be found in the
[styleguide](http://contentful.github.io/ui-extensions-sdk/styleguide).


## Examples

This repo includes the following example widget implementations. Before you can
use them, you need to run `npm install` in the repository root.

#### [Basic Rating Dropdown](examples/rating-dropdown)

![rating-dropdown](http://contentful.github.io/ui-extensions-sdk/assets/rating-dropdown.png)

This example is a basic widget meant to help you *get started* with custom widgets development. Uses a dropdown to
change the value of a number field and makes some CMA requests.

#### [Rich Text Editor](examples/alloy-editor)

![alloy-editor](http://contentful.github.io/ui-extensions-sdk/assets/alloy-editor.png)

This example integrates the [Alloy rich-text/HTML editor](http://alloyeditor.com/) to
edit “Text” fields. Great to personalize the entry editor and enable HTML editing as an alternative to Markdown.

#### [Slug Generator](examples/slug)

![slug-widget](http://contentful.github.io/ui-extensions-sdk/assets/slug-widget.png)

This example will automatically generate its values from an entries title field.
For example typing “Hello World” into the title field will set the widgets input
field to “hello-world”. It will also check the uniquness of the slug across a
customizable list of content types. It highlights how the widget API can be used to *inspect any value*
of an entry and *react to changes*.

#### [JSON Editor](examples/json-editor)

![json-editor-ok](http://contentful.github.io/ui-extensions-sdk/assets/json-editor.png)

This example provides a JSON formatter and validator based on the [Codemirror](http://codemirror.net) library. It should be used with fields with the type “Object”.

#### [JSON Form Editor](examples/json-form-editor)

![json-form-editor](http://contentful.github.io/ui-extensions-sdk/assets/json-form-editor.png)

This example integrates the [JSON Editor](https://github.com/jdorn/json-editor)
library to display an edit form based on a predefined [JSON Schema](https://json-schema.org/).
Form input gets stored as a JSON object.

#### [Translator](examples/translate)

![translate-widget](http://contentful.github.io/ui-extensions-sdk/assets/translate-widget.png)

This example translates text from the default locale to other locales in a space using the Yandex translation API.

#### [Wistia Videos](examples/wistia)

![Screenshot of Wistia widget](http://contentful.github.io/ui-extensions-sdk/assets/wistia.gif)

The example widget loads videos from a [project](http://wistia.com/doc/projects) on [wistia](http://wistia.com/) into the Contentful Web Application. A video can be easily previewed, selected and then stored as part of your content. In this example widget we store the video embed URL in Contentful so the video can be embedded easily.

#### [YouTube ID](examples/youtube-id)

![youtube-id](http://contentful.github.io/ui-extensions-sdk/assets/youtube-id.png)

This example extracts the video id from a valid YouTube URI. Useful as a simple way to integrate with 3rd party media services.

#### [Chessboard](examples/chessboard)

![Chessboard Widget in action](http://contentful.github.io/ui-extensions-sdk/assets/chessboard.gif)

This example displays a chessboard and stores the board position as a JSON
object. You can drag pieces on the chessboard and the position data will be
updated automatically. The widget also supports *collaborative editing*. If two
editors open the same entry moves will be synced between them. It highlights the flexibility and potential of solutions that can be built using the UI Extensions SDK.

## Providing feedback

Technical feedback can be provided directly through the Github repo. However, if at any point some confidential or business sensitive information needs to be discussed, then the conversation should be handled via our formal support channels.
