# App SDK

The App SDK (formerly known as UI Extensions SDK) is a JavaScript library that allows developers to create custom Contentful Apps
for the Contentful Web App. Every Contentful App has to include the library in its source.

## Resources

- [App SDK reference](https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/)
- [App Framework general documentation](https://www.contentful.com/developers/docs/extensibility/app-framework/)
- [UI Extensions general documentation](https://www.contentful.com/developers/docs/extensibility/ui-extensions/)
- [Contentful Apps Management HTTP API reference](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/app-definitions)
- [Contentful Apps FAQ](https://www.contentful.com/developers/docs/extensibility/app-framework/faq/)
- [Contentful Apps repository](https://github.com/contentful/apps)
- [Contentful Marketplace](https://www.contentful.com/developers/marketplace/)
- [Contentful Changelog](https://www.contentful.com/developers/changelog/)
- [Forma 36: The Contentful Design System](https://f36.contentful.com/)
- [Forma 36 guide for Contentful Apps](https://www.contentful.com/developers/docs/extensibility/ui-extensions/component-library/)
- [`create-contentful-app`](https://github.com/contentful/create-contentful-app) - CLI tool for developing apps without the hassle of managing build configurations
- [`contentful-ui-extensions-sdk` at npm](https://www.npmjs.com/package/contentful-ui-extensions-sdk)

## Getting help

Technical questions, feedback or feature request can be provided directly through the Github issues
for this repository. However, if you are a paying customer or at any point business sensitive
information needs to be discussed, then the conversation should be handled via our
[support system](https://www.contentful.com/support/).

## Development

### Publishing

A new package version is automatically published to npm using [semantic-release](https://github.com/semantic-release/semantic-release).

To manually publish the package, run `npm run publish-all`.

This repository is published as two packages with identical data. We recommend using `@contentful/app-sdk`.

- `@contentful/app-sdk`
- `contentful-ui-extensions-sdk`

#### Canary releases

This package has two main development streams: `latest` and `canary`.

The default and stable releases are always published under the `latest` tag (as per npm convention).
The release under the `canary` tag is to be considered unstable and potentially breaking.
You should not rely on it in production.

To start a new alpha version of the package follow these steps:

1. Checkout the `canary` branch.
2. Reset canary to the latest main: `git reset --hard origin/main`
3. Create a new branch with your changes from `canary`
4. Create a PR that merges into `canary`.

### File Structure

#### `docs`

Former home of the documentation and reference for this library. This is now deprecated and you should use links above.

#### `lib`

Includes the files constituting the SDK and the associated types.

Top level files are split by feature. Most of them map 1-to-1 to an API (keep reading for the outliers). When APIs are
considered too small to be in a separate file, they are part of the [`api`](./lib/api.ts) file.

- [`channel`](./lib/channel.ts) and [`signal`](./lib/signal.ts) abstract the communication between an App and the host;
- [`locations`](./lib/locations.ts) exports available location where you can run App;
- [`initialize`](./lib/initialize.ts) creates an initializer to start an App within Contentful's App Framework.

All the typings are in the [`types`](./lib/types) folder and they map 1-to-1 APIs, when they make sense.
The [`entities`](./lib/types/entities.ts) file maps Contentful entities in TypeScript.
[`utils`](./lib/types/utils.ts) includes utility types, meant to save on characters to type.

#### `scripts`

Includes utility tools for maintainers.

#### `test`

Includes unit tests (run by [mocha](https://mochajs.org/))
