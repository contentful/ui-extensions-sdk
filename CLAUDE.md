# Claude Project Instructions — `ui-extensions-sdk`

You are working in the **`ui-extensions-sdk`** repo (`github.com/contentful/ui-extensions-sdk`). It builds the **App SDK** and publishes it to npm as `@contentful/app-sdk` (preferred) and the legacy `contentful-ui-extensions-sdk` alias. Read [AGENTS.md](./AGENTS.md) and [ARCHITECTURE.md](./ARCHITECTURE.md) before making non-trivial changes.

## Identity & Scope

- This is a public, customer-facing TypeScript library. Public types are a contract: thousands of customer apps and many internal repos consume `lib/types/index.ts`.
- Co-owned by `@contentful/team-extensibility` and `@contentful/team-marketplace`.
- Bundle size is policed by CI. Adding a runtime dependency is almost always wrong — `contentful-management` is currently the only one.

## Working style

- **Conventional Commits** at PR-title level. Use `feat:`, `fix:`, `chore:` (no release), `docs:` (no release), `refactor:` (no release).
- **Breaking changes** require a `BREAKING CHANGE:` footer — `feat!:` alone does not bump major reliably.
- **One unit test per module** under `test/unit/<module>.spec.ts`.
- **No `any`** in public types. `unknown` is acceptable internally.
- **Squash merge.** PR title becomes the commit message.

## Sharp edges

1. Do not edit `package.json#name` — `scripts/publish.js` mutates it during dual-publish.
2. Do not add methods to `lib/space.ts` — it is deprecated since v4.0.0.
3. Do not reference `globalThis.contentfulExtension` in new code; it's a back-compat alias only.
4. Do not run `npm install` if you don't have to — `npm ci` is the source of truth and CI uses it.
5. Do not skip the husky pre-commit hook with `--no-verify` unless the hook itself is broken.
6. Do not introduce ESM-only dependencies — the bundle is UMD-target ES5.

## Verification before claiming done

```bash
npm run check-types
npm run lint
npm test
npm run build
npm run size
```

If any of these fail, the work is not done. Fix the root cause; do not bypass.

## When adding a new location

1. Add the constant to `lib/locations.ts`.
2. Add the SDK type to `lib/types/api.types.ts` (a new `<Name>AppSDK` and the `Locations` interface).
3. Add the location to `LOCATION_TO_API_PRODUCERS` in `lib/api.ts`.
4. Add a producer factory in a new `lib/<name>.ts` if the location needs a unique surface.
5. Add a unit test in `test/unit/<name>.spec.ts`.
6. Add the new SDK type to the `KnownAppSDK` union.

The newest examples to model on are `lib/agent.ts` (the AI agent location) and the `Agent*` types.

## Tool boundaries

- **Edit**: source code in `lib/`, tests in `test/`, configs in repo root.
- **Don't edit**: `dist/` (generated), `docs/` (legacy GitHub Pages CDN — see `docs/WARNING.txt`), `CHANGELOG.md` (semantic-release owns it).
- **Don't run**: `npm publish`, `npm version`, manual git tags. Releases are automated.

## Reference

- Contentful Docs: https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/
- CI alerts: `#prd-extensibility-bots`
