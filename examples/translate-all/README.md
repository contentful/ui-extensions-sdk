# “Translate All Content” Sidebar Widget

This widget translates text of all the entry's fields from the default locale to all
other locales enabled in the space, using the
[Yandex translation API](https://translate.yandex.com/developers).

## Bootstrap example for local development

In the directory containing this README, run
```bash
npm install
```

First set the access token on your environment, then create the widget on Contentful:
```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<contentfulManagementApiToken>
contentful-widget create --space-id <yourSpaceId>
```

Serve on `http://localhost:3000`:
```bash
gulp watch
```
This does automatically serve again on any change to the source files, so you only
need to manually refresh your browser to see the changes.

**Note:** Since the Contentful App is served through HTTPS while the widget code is
loaded from your local machine through HTTP, you need to enable insecure content.
See here how to do it in [Firefox][ff-mixed] and [Chrome][chrome-mixed].

[ff-mixed]: https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox
[chrome-mixed]: https://support.google.com/chrome/answer/1342714

## Upload widget
If you want to inline all dependencies and upload the widget entirely to Contentful:
```bash
gulp bundle
contentful-widget update --srcdoc ./dist/index.min.html --space-id <yourSpaceId> --force
```
