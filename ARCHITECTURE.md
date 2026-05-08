# Architecture — contentful-ui-extensions-sdk / @contentful/app-sdk

## Overview

The App SDK is the **communication bridge** between a Contentful app (running in an iframe) and the Contentful host application. It uses a PostMessage-based channel to expose Contentful data and actions to app code in a safe, sandboxed way.

## How It Works

```
Contentful Host App (parent frame)
        │
        │  window.postMessage (structured messages)
        ▼
App iframe (app code calls sdk.field.getValue(), etc.)
        │
        └── lib/channel.ts       (PostMessage send/receive abstraction)
                └── lib/signal.ts    (event subscription over a channel)
                        └── lib/initialize.ts  (creates SDK instance)
                                └── lib/api.ts     (routes to location-specific API objects)
```

## Module Structure

| Module | Role |
|--------|------|
| `lib/initialize.ts` | Connects to host frame; creates the SDK instance passed to `init()` callback |
| `lib/channel.ts` | PostMessage send/receive abstraction |
| `lib/signal.ts` | Event subscription over a channel |
| `lib/api.ts` | Factory — builds the correct SDK object for the current location |
| `lib/field.ts` | Field-level API (get/set value, validate) |
| `lib/field-locale.ts` | Field API with locale selection |
| `lib/entry.ts` | Entry-level API |
| `lib/editor.ts` | Entry editor API |
| `lib/app.ts` | App lifecycle hooks (`setReady`, `onConfigure`, `getParameters`) |
| `lib/window.ts` | Window/size control (`updateHeight`, `startAutoResizer`) |
| `lib/space.ts` | Space read/write API (wraps CMA calls through the channel) |
| `lib/dialogs.ts` | System dialog management |
| `lib/navigator.ts` | Host navigation API |
| `lib/cma.ts` + `lib/cmaAdapter.ts` | CMA adapter (passes CMA calls through the channel to the host) |
| `lib/locations.ts` | `locations` enum |
| `lib/types/` | All public TypeScript types — no runtime code |

## Location SDK Variants

`lib/api.ts` builds a different SDK object depending on which Contentful location the app is rendering in:

| Location | SDK Type |
|----------|----------|
| `entry-field` | `FieldAppSDK` |
| `entry-sidebar` | `SidebarAppSDK` |
| `entry-editor` | `EditorAppSDK` |
| `app-config` | `AppExtensionSDK` |
| `dialog` | `DialogAppSDK` |
| `page` | `PageAppSDK` |
| `home` | `HomeExtensionSDK` |

## Build Pipeline

```
lib/**/*.ts
  → Rollup (rollup.config.js)
      → dist/cf-extension-api.js          (UMD, minified)
      → dist/cf-extension-api.bundled.js  (CDN self-contained bundle)
  → tsc
      → dist/index.d.ts                   (TypeScript declarations)
```

- Target: ES5 (broad browser compatibility)
- Format: UMD (works in CommonJS and browser globals)
- Minification: Terser (production); source maps available via `build:debug`

## Dual-Package Publish

The same build is published under two npm package names:

1. `@contentful/app-sdk` — modern scoped name
2. `contentful-ui-extensions-sdk` — legacy name

`scripts/publish.js` temporarily mutates `package.json` `name` field and runs `npm publish` twice. Semantic-release triggers this on `master` and `canary` branches.

## CI / Release

```
Every commit (CircleCI):
  unit → lint + test + build + size check

master/canary branches (after unit):
  semantic-release → version bump → dual npm publish
```

- **`master`**: publishes `latest` tag
- **`canary`**: publishes `X.Y.Z-alpha.N` under `canary` dist-tag

## Key Dependencies

| Package | Role |
|---------|------|
| `contentful-management` | Only production dependency — CMA adapter types |
| `rollup` + `terser` | Bundler + minifier |
| `ts-mocha` + `mocha` | Test runner |
| `chai` + `sinon` | Assertions + mocking |
| `jsdom` | Browser DOM simulation in tests |
| `semantic-release` | Automated versioning + publish |
