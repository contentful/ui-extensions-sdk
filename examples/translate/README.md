# Translation widget

This widget translates text from the default locale to other locales in a space using the Yandex translation API.

### Bootstrap example for local development

Move into this example directory and install dependencies
```bash
cd examples/translate
npm install
```

Set the access token on your environment:
```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<contentfulManagementApiToken>
```

Create the widget:
```bash
contentful-widget create --space-id <yourSpaceId>
```

Serve on http://:::3000
```bash
gulp
```

Your widget will now be accessible via the Contentful web app.
In order to to use this widget, create a Content Type with a field of type `Symbol` or `Text`. You will need to enable localization on the field to use the translation feature.


### Upload widget
If you want to inline all dependencies and upload the widget entirely to Contentful:
```bash
contentful-widget create --srcdoc ./dist/index.all.html --space-id <yourSpaceId> --force
```

