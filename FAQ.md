# FAQ

## How is the extension iframe sandboxed?

We use the [HTML5 sandbox attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox) on the iframe to separate an extension from the Contentful Web App.
The following sandbox flags are enabled

- `allow-scripts`: This allows the extension to run javascript in its own sandbox
- `allow-popups`: This allows the extensions to open new browser windows.
- `allow-popups-to-escape-sandbox`: This removes the sandbox restriction from windows opened from the sandboxed document.

Note that we do not set `allow-same-origin` flag and hence the iframe will have an origin of `null`.

## May I open modal overlays on top of the entire Contentful page?

No, the iframe sandboxing restrictions will prevent you from doing so.

## May I open regular javascript popups from an extension?

Yes, you can use `window.open()` and links with `target="_blank"`

## Is it mandatory to host my extensions on HTTPS?

We do not allow you to reference non-HTTPS URLs (like `http://`) with the exception of URLs starting with `http://localhost` for development purposes.
If you serve the extension from `localhost` you need to disable mixed content protection in [firefox](https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox) and [chrome](https://support.google.com/chrome/answer/1342714).

## Is CORS required?

As the extension is run in a sandboxed Iframe it receives the origin `null`.
Therefore, if you’re using custom web fonts, things don't work as expected as they don’t play well with sandboxed iframes at the moment.

To overcome this, you can configure your servers to send the following headers:
`Access-Control-Allow-Origin` `null` or  `Access-Control-Allow-Origin` `*`

## What happens when deploying a broken extension?

If the URL defined in your `extension.json` is invalid or contains errors, then the extension will either not show up or show as broken.

## How do you debug extensions?

Most of [our examples](https://github.com/contentful/bundles/tree/master/extension) demonstrate how to deploy an extension running on a local web server, so you can use your browser console to debug it the same way you debug any other web application.

## With which permissions does an extension run?

An extension runs with the permissions of the user displaying it, not with the ones from the user publishing the extension itself. This means the extensions needs to provide a fallback behaviour in case it tries to perform an action the current user is not allowed to do.

## What are the guidelines for choosing extension names?

There is no strong validation of extension names, but remember that long ones will break the layout.

## Can user provide a extension thumbnail?

This is not possible right now, but we’re working on adding this possibility in the future.

## What happens with the content once a extension is removed?

The content is independant from the extension that is used to edit it. When you remove an extension the content is still there and you can choose another appearance from the field’s settings.

## Can the extension destroy my content?

In theory yes, since they have access to all the content the user that is running the extension has. Make sure you implement safeguards to avoid losing your content.

## What are the core components and how do they differ from extensions?

Core components are what we provide as a part of the Contentful Web Application. Our core components are currently leveraging the same API that the UI Extension SDK provides, and we are planning to open source them so you can actually create custom extensions based on them.

## How do I migrate to the new version of the UI Extensions SDK?

If you were building extensions as a part of the beta program from March to July 2016, then you will need to update your extensions for them to continue working. Since the term 'widget' has been deprecated in favor of 'extensions', here are the parts that you need to update:

### CLI tool

- The `contentful-widget-cli` package is now `contentful-extension-cli`. This package will offer the `contentful-extension` utility instead of `contentful-widget`
- Versions >= `2.0.0` of the `contentful-extension-cli` should be used with versions >= `2.0.0` of the UI Extensions SDK

### Extension code

- Rename your `widget.json` file to `extension.json`
- If you use the `contentful-widget-sdk` NPM package please switch to `contentful-ui-extensions-sdk`.
- In your main HTML file CSS and JS link references have to be updated as follows:
  - `https://contentful.github.io/widget-sdk/cf-widget-api.css` becomes `https://contentful.github.io/ui-extensions-sdk/cf-extension.css`
  - `https://contentful.github.io/widget-sdk/cf-widget-api.js` becomes `https://contentful.github.io/ui-extensions-sdk/cf-extension-api.js`
- The `contentfulWidget` variable on window becomes `contentfulExtension`, meaning that you'll need to call `contentfulExtension.init(function () { ...` instead of `contentfulWidget.init(function () { ...`

### API

API endpoints will be updated as follows:

- `spaces/XYZ/widgets` endpoint is deprecated in favor of `spaces/XYZ/extensions` for `GET` and `POST` methods
- `spaces/XYZ/widgets/ABC` endpoint is deprecated in favor of `spaces/XYZ/extensions/ABC` for `PUT`, `DELETE` and `GET` methods

This change has no impact if you're using the CLI tool to manage your extension.
