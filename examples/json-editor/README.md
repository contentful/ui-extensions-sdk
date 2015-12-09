# JSON Editor widget

This widget provides a JSON formatter and validator based on the [Codemirror](http://codemirror.net) library.

It should be used with fields with the type “Object”.


### Bootstrap example for local development

First set the access token on your environment:
```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<contentfulManagementApiToken>
```

Create the widget:
```bash
contentful-widget create --space-id <yourSpaceId>
```

Move into example directory and install dependencies
```bash
cd examples/json-editor && npm install
```

Serve on http://:::3000
```bash
gulp
```

### Upload widget
If you want to inline all dependencies and upload the widget entirely to Contentful:
```bash
contentful-widget update --srcdoc ./dist/index.all.html --space-id <yourSpaceId> --force
```
