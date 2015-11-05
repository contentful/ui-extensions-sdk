##Abstract
Contentful is in the process of adding Custom Widgets to the system. These widgets will allow our customers to extend and tailor to their needs the features provided by the UI. To simplify the management of the widgets (creation, update, deletion, read) we want to build a tool that takes care of all the low level details involved in talking with the Widgets Backend API to perform any of the mentioned CRUD operations.

### Usage
Following is an overview of the different operations supported by the CLI.

#### Authentication

The CLI will make requests to the CMA on behalf of the user. Therefore the user will have to provide his oauth token:

```
$ CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=TOKEN cli
```

### Creating a widget
Users can create widgets by providing a link to an URL where the widget code is or by uploading the code itself. The CLI should support both ways:

```
$ cli create --space SPACE_ID -f PATH_TO_FILE
$ cli create --space SPACE_ID -u URL
```

Users can specify the id of the widget

```
$ cli create --space SPACE_ID --id ID -u URL
$ cli create --space SPACE_ID --id ID -f PATH_TO_FILE
```

####Fetching a wiget
Users should be able to fetch the contents of a widget

```
$ cli read --space SPACE_ID --id ID
```

####Fetching all widgets
Users should be able to list all the widgets for the given space

```
$ cli read --space SPACE_ID
```

Users should also be able to get a summary view of all their widgets. This summary would include:

- widget id
- creation date
- last update
- user who created the widget

```
$ cli read --space SPACE_ID --summary
```

#### Updating a widget
Users should be able to update the contents of an already existing widget

```
$ cli update --space SPACE_ID --id ID -u URL -v VERSION
$ cli update --space SPACE_ID --id ID -f PATH_TO_FILE -v VERSION
```
 
Users should be able to update the contents of an already existing widget without passing the version value. The cli will fetch the current representation of the widget and use its version as the version for the update.

```
$ cli update --space SPACE_ID --id ID -u URL
$ cli update --space SPACE_ID --id ID -f PATH_TO_FILE
```
 
#### Deleting a widget

```
$ cli delete --space SPACE_ID --id ID
```
