# Agent Guide — contentful-ui-extensions-sdk / @contentful/app-sdk

## What This Repo Does
The App SDK (published as both `@contentful/app-sdk` and the legacy `contentful-ui-extensions-sdk`) is the core runtime library every Contentful app must use. It provides the `init()` entry point, PostMessage-based communication with the Contentful host application, and TypeScript types for all SDK locations.

## Ownership
`@contentful/team-marketplace` (full, co-owned with `@contentful/team-extensibility`)

## Structure

```
lib/              # TypeScript source — one file per API module
lib/types/        # All public TypeScript types and interfaces
test/unit/        # Mocha test specs — one per module
dist/             # Built UMD output (generated — do not edit)
scripts/          # Custom dual-publish scripts
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for the full picture.

## Key Exports

| Export | Description |
|--------|-------------|
| `init(callback, options?)` | Entry point — connects app to host frame |
| `locations` | Enum of all valid app locations |
| `FieldAppSDK`, `SidebarAppSDK`, `PageAppSDK`, etc. | Location-specific SDK types |
| `AppExtensionSDK` | Config screen SDK type |
| `HomeExtensionSDK` | Home location SDK type |
| `DialogAppSDK` | Dialog SDK type |

## Published as Two Package Names
Same code, two npm packages:
- `@contentful/app-sdk` — modern scoped name (use this in new code)
- `contentful-ui-extensions-sdk` — legacy name (still live, do not remove)

Custom publish scripts in `scripts/publish.js` handle both. Semantic-release drives versioning.

## Sharp Edges & Invariants

- **UMD output, not ESM** — build target is UMD via Rollup. Do not assume tree-shaking; keep the bundle small.
- **Mocha, not Vitest** — tests use `ts-mocha` + Chai + Sinon + jsdom. Do not introduce Vitest.
- **No `any` in public types** — every exported type must be explicit. `unknown` is acceptable internally.
- **Breaking changes require major version** — this SDK has thousands of app consumers. Removing or renaming any public export is a breaking change.
- **Canary releases** from the `canary` branch publish as `X.Y.Z-alpha.N` under the `canary` dist-tag. Do not merge canary work to master until stable.
- **PostMessage channel only** — all SDK calls go through `channel.ts`. Do not add direct DOM access or `window` globals.

## Never / Always

- **Never** access `window.contentfulExtension` directly — that is the pre-SDK legacy pattern.
- **Never** remove or rename a public type export without bumping the major version.
- **Always** add a test in `test/unit/` for any new module or API surface.
- **Always** run `npm run check-types` before opening a PR — type errors in a types library are blocking.
- **Always** run `npm run size` after build changes — the gzip size limit is enforced in CI.
