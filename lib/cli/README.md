## Usage
Following is an overview of the different operations supported by the CLI.


### Creating a widget
A widget can be created by providing a link to an URL where the widget code is or by uploading the code itself. The CLI supports both ways:

```
$ cli create --space SPACE_ID -f PATH_TO_FILE
```

```
$ cli create --space SPACE_ID -u URL
```
 
The id of the widget can be specified:

```
$ cli create --space SPACE_ID --id ID -u URL
```

```
$ cli create --space SPACE_ID --id ID -f PATH_TO_FILE
```

### Fetching a wiget
Fetch a widget from the API:

```
$ cli read --space SPACE_ID --id ID
```

### Updating a widget
A widget can be update by providing a link to an URL where the widget code is or by uploading the code itself. The CLI supports both ways:

```
$ cli update --space SPACE_ID --id ID -u URL -v VERSION
```

```
$ cli update --space SPACE_ID --id ID -f PATH_TO_FILE -v VERSION
```

A widget ca also be updated without passing the version value. The cli will fetch the current representation of the widget and use its version as the version for the update.

```
$ cli update --space SPACE_ID --id ID -u URL
```

```
$ cli update --space SPACE_ID --id ID -f PATH_TO_FILE
```
 
### Deleting a widget
A widget can be deleted:

```
$ cli delete --space SPACE_ID --id ID
```

## Miscellaneous

#### Host selection
All the commands can take a `--host` option which lets you set the host where the API is run.

#### Authentication
The CLI will make requests to the CMA on behalf of the user. Therefore the user will have to provide his oauth token:
``` 
$ CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=TOKEN cli
```