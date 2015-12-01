## Introduction
Contentful allows customers to customize and tailor the UI using custom made widgets. Widgets have to be uploaded to Contentful in order to be able to use them in the UI.

This repo hosts `contentful-widget` a Command Line Tool (CLI) developed to simplify the management tasks associated with custom widgets. With the CLI you can:

- Create widgets
- Update existing widgets
- Read widgets
- Delete widgets


## Available commands

`contentful-widget` is composed of 4 subcommands that you can use to manage the widgets.

**create a widget**

```
contentful-widget create [options]
```
Use this subcommand to create the widget for the first time. Succesive modifications made to the widget will be have to be using the `update` subcommand.

**read a widget**

```
contentful-widget read [options]
```
Use this subcommand to read the widget payload from Contentful. With this subcommand you can also list all the widgets in one space.

**update a widget**

```
contentful-widget update [options]
```
Use this subcommand to modify an existing widget.
 
**delete a widget**

```
contentful-widget delete [options]
```

Use this subcommand to pertmanently delete a widget from Contentful.

For a full list of all the options available on every subcommand use the `--help` option.

## Misc

The following sections describe a series of concepts around the widgets and how the CLI deals with them.

### Widget properties

The following table describes the properties that can be set on a widget.

Property | Required| Type | Description
---------|---------|------|------------
name | yes | String | Widget name
fieldTypes | yes | List * | Field types where a widget can be used
src | ** | String | URL where the widget bundle can be found
srcdoc | ** | String | Widget bundle serialized as a string
sidebar | no | Boolean | Controls the location of the widget. If `true` it will be rendered on the sidebar

\* One of `src` or `srcdoc` have to be present

\** Valid field types are: `Symbol`, `Symbols`, `Text`, `Integer`, `Number`, `Date`, `Boolean`, `Object`, `Entry`, `Entries`, `Asset`, `Assets`

#### Specifying widget properties

Subcommands that create of modify a widgets (`create` and `upload`) accept the properties for the widget in two forms: command line options or a JSON file.

##### Command line options

For every property in the widget there's a corresponding long option with the same name. So for example, there's a `name` property and so a `--name` option too.

```
contentful-widget create --space-id 123 --name foo --src foo.com/widget
```
Note that camelcased property names like `fieldTypes` are hyphenated (`--field-types`).

##### Descriptor files

Descriptor files are JSON files that contain the values that will be sent to the API to create the widget. By default the CLI will look in the current working directory for a descriptor file called `widget.json`. Another file can be used witht the `--descriptor` option.

A descriptor file can contain:

- All the widget properties (`name`, `src`, ...). Please note that the `srcdoc` property has to be a path to a file containing the widget bundle.
- An `id` property. Including the `id` in the descriptor file means that you won't have to use the `--id` option when creating or updating a widget.

All the properties included in a descriptor file can be overriden by its counterpart command line options. This means that, for example, a `--name bar` option will take precedence over the `name` property in the descriptor file. Following is an example were the usage of descriptor files is explained:

Assuming that there's a `widget.json` file in the directory where the CLI is run and that's its contents are:

```json
{
  "name": "foo",
  "src": "foo.com/widget",
  "id": "foo-widget"
}
```

The following command

```
contentful-widget create --space-id 123 --name bar
```

Will create the following widget. Note that the `name` is `bar` and that the `id` is `foo-widget`.

```json
{
  "name": "bar",
  "src": "foo.com/widget",
  "id": "foo-widget"
  "sys": {
   "id": "foo-widget"
   ...
  }
}
```


### Authentication

Widgets are managed via the Contentful Management API (CMA).
You will therefore need to provide a valid access token in the
`CONTENTFUL_MANAGEMENT_ACCESS_TOKEN` environment variable.

Our documentation describes [how to obtain a token](https://www.contentful.com/developers/docs/references/authentication/#getting-an-oauth-token).


### Version locking

Contentful API use [optimistic locking](https://www.contentful.com/developers/docs/references/content-management-api/#/introduction/updating-and-version-locking) to ensure that accidental non-idemptotent operations (`update` or `delete`) can't happen.

This means that the CLI  needs to know the current version of the widget when using the `update` and `delete` subcommands. On these case you have to specify the version of the widget using the `--version` option.

If you don't want to use the `--version` option on every update or deletion, the alternative is to use `--force`. When the `--force` option is present the CLI will automatically use the latest version of the widget. Be aware that using `--force` option might lead to accidental overwrites if multiple people are working on the same widget.

