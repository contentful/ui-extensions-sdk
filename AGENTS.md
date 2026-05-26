# Agent Guide — `ui-extensions-sdk`

## Identity
This is the **`ui-extensions-sdk`** repository (`github.com/contentful/ui-extensions-sdk`). It builds and publishes the **App SDK** to npm under two package names: **`@contentful/app-sdk`** (preferred — use this in all new code, examples, and documentation) and **`contentful-ui-extensions-sdk`** (legacy alias retained for installed-base compatibility). Repo name and package names diverged for historical reasons; do not rename the repo.

## Ownership
`@contentful/team-extensibility` and `@contentful/team-marketplace` (co-owned per [`.github/CODEOWNERS`](./.github/CODEOWNERS)).

## Where to look
| You want to… | Read this |
|---|---|
| Understand the runtime + build pipeline | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Develop locally / run tests / open a PR | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| See the consumer-facing reference | [Contentful Docs — App SDK Reference](https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/) |

## Sharp edges (do not violate)

1. **Public types are a contract.** Changing or removing any export from `lib/types/index.ts` is a breaking change. Hundreds of customer apps and many internal Contentful repos consume these types. A breaking change requires a `feat!:` commit + `BREAKING CHANGE:` footer (the major bump is otherwise silently dropped without the footer).

2. **Bundle size is policed by CI.** `npm run size` reports gzipped bytes of `dist/cf-extension-api.js` after every build. Adding a runtime dependency or a heavy utility is *almost always* the wrong move — `contentful-management` is currently the **only** runtime dep. Re-implementing a small helper inline beats pulling in a package.

3. **PostMessage is the only transport.** All host communication routes through [`lib/channel.ts`](./lib/channel.ts). Do not add direct DOM, `fetch`, or global-window access for host operations. If you need a new capability from the host, add a method on the channel and contract its protocol with the web app team.

4. **Space API is deprecated since v4.0.0.** Every call in `lib/space.ts` emits a `console.warn` recommending the CMA client. Do not add new methods. There is no current timeline for removal — the deprecation persists indefinitely; new CMA-backed work goes via `sdk.cma`.

5. **Two npm packages, one source.** `scripts/publish.js` mutates `package.json#name` between publishes (it's reset in a `try/finally` once the publish run finishes). Never edit `name` directly in `package.json` — there is no general-purpose auto-restore for unrelated manual edits, only the per-publish cleanup in `scripts/shared.js#restorePackageJson`.

6. **Canary is not a feature branch.** The `canary` branch publishes alpha versions under the `canary` dist-tag (`X.Y.Z-alpha.N`). Reset `canary` to `main` before starting alpha work. Forward-port a canary-tested fix to `main` via a fresh PR — don't direct-merge the `canary` branch into `main`, since that drags every prior alpha commit's history along.

7. **`globalThis.contentfulExtension` is a compatibility alias** for `globalThis.contentfulApp` (set in `rollup.config.js`). Do not reference `contentfulExtension` in new code; it exists only to keep CDN script-tag installs working.

8. **Treat security-related Dependabot PRs as priority** — the SDK ships to many installations and a vulnerable transitive dependency reaches all of them.

9. **`LOCATION_AGENT` ships in code but is host-flagged.** The SDK exports `AgentAppSDK` and `LOCATION_AGENT` from v4.46.0 onward, but customers cannot render an agent app until the host enables the corresponding feature flag for their space. When making changes here, remember that the SDK is only half the contract — host-side flag and rendering changes coordinate through the relevant host team.

10. **`LOCATION_HOME` apps must NOT use auto-resizer behavior.** `sdk.window` isn't on `HomeAppSDK` (the type omits it — see `lib/types/api.types.ts`), so `sdk.window.startAutoResizer()` is a TypeScript error and won't compile. The real footgun is `useAutoResizer()` from `@contentful/react-apps-toolkit` — it accepts the home SDK but produces no effect because the host manages sizing for the home location at the platform level.

## Locations the SDK supports

These are the values of `data.location` that `lib/api.ts` knows how to compose an SDK for. Defined in `lib/locations.ts`.

| Location constant | String value | SDK type | Notes |
|---|---|---|---|
| `LOCATION_ENTRY_FIELD` | `entry-field` | `FieldAppSDK` | |
| `LOCATION_ENTRY_FIELD_SIDEBAR` | `entry-field-sidebar` | `FieldAppSDK` | |
| `LOCATION_ENTRY_SIDEBAR` | `entry-sidebar` | `SidebarAppSDK` | |
| `LOCATION_ASSET_SIDEBAR` | `asset-sidebar` | `SidebarAppSDK` (asset variant) | |
| `LOCATION_ENTRY_EDITOR` | `entry-editor` | `EditorAppSDK` | |
| `LOCATION_DIALOG` | `dialog` | `DialogAppSDK` | |
| `LOCATION_PAGE` | `page` | `PageAppSDK` | |
| `LOCATION_HOME` | `home` | `HomeAppSDK` | Host manages sizing — do **not** call `useAutoResizer()` here. |
| `LOCATION_APP_CONFIG` | `app-config` | `ConfigAppSDK` | |
| `LOCATION_AGENT` | `agent` | `AgentAppSDK` | Ships in SDK from **v4.46.0**. Host rendering is gated by a feature flag — coordinate with the host team to enable. |

When adding a new location: update `lib/types/api.types.ts` (`Locations` interface, new `<Name>AppSDK` type, **and** add it to the `KnownAppSDK` union — easily missed), `lib/locations.ts` (constant), `lib/api.ts` (`LOCATION_TO_API_PRODUCERS` mapping + a producer factory if needed), and add a unit test in `test/unit/api.spec.ts`. CLAUDE.md expands on each step.

## Type aliases (deprecated)

Every legacy `*ExtensionSDK` type (`FieldExtensionSDK`, `SidebarExtensionSDK`, `AppExtensionSDK`, etc.) is `@deprecated` in `lib/types/api.types.ts`. They alias to their `*AppSDK` equivalents and exist for backward compatibility only. Do not introduce new code that uses or extends the deprecated names.

## High-traffic areas (extra caution)

These three modules are touched by every SDK consumer on every page load. A regression here propagates to thousands of customer apps within a release window. Treat changes in these files as having outsized blast radius:

- **`lib/channel.ts`** — the PostMessage transport. Every host call routes through it. Changes here can break every API method simultaneously and are not testable without exercising the full handshake (see `test/helpers.ts` for the jsdom + mockMutationObserver setup the test suite relies on).
- **`lib/types/index.ts`** — the public type contract barrel. A removed or renamed export is a breaking change for every customer app and every internal Contentful repo importing the SDK.
- **`lib/api.ts`** — the location-specific producer mapping. A typo in `LOCATION_TO_API_PRODUCERS` falls back to `DEFAULT_API_PRODUCERS` silently, causing the wrong SDK shape to ship for the affected location.

**Mitigations** for non-trivial changes here:
1. Run the full local verification suite (below) plus `npm run size` to catch bundle regressions.
2. Cut a `canary` release and exercise it through downstream consumers before merging to `main` — see ARCHITECTURE.md "Cross-repo testing for non-trivial SDK changes" for the observed playbook.
3. For type-surface changes specifically: open the PR, then identify likely-affected consumers via `gh search code 'from "@contentful/app-sdk"' --owner contentful`. `git grep` is local-only and won't find cross-repo consumers.

## Verification commands

Run before opening a PR — these match what CI runs.

```bash
npm ci
npm run lint
npm run check-types
npm test
npm run build
npm run size
```

## Never / Always

- **Never** reference `window.contentfulExtension` directly in new code or examples.
- **Never** introduce a runtime dependency without explicit team review of the size cost and necessity.
- **Never** add a method to `lib/space.ts` — that API is freezing toward removal.
- **Never** change a public type signature without a `feat!:` commit + `BREAKING CHANGE:` footer.
- **Always** add a unit test in `test/unit/<module>.spec.ts` for any new module — one spec per module is the convention.
- **Always** update `lib/types/api.types.ts` `ConnectMessage` when adding a host-driven message field.
- **Always** keep `lib/types/index.ts` as the single export point — don't introduce additional barrel files.
