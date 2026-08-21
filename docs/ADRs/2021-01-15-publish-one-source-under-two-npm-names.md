# Publish one source tree under two npm package names

## Status

Accepted

## Context

This repository is named `ui-extensions-sdk` and has published to npm as
`contentful-ui-extensions-sdk` since its early releases. The product it ships was subsequently
renamed: UI Extensions became the App Framework, and this library became the **App SDK**. The
repository name, the historical package name, and the current product name therefore all differ.

A published npm package cannot be renamed in place. Existing installs, committed lockfiles,
CI pipelines, CDN script tags, and third-party documentation all reference the old specifier.
Publishing the renamed library only under a new name would strand every existing consumer on
whatever version they had pinned, with no upgrade path that did not require a code change.

When semantic-release was introduced (`8b61283`, #455), the publish step was therefore made
multi-name. It initially hedged across the full cross-product of scoped and unscoped variants
of both the old and new product names — four packages:

```js
const PACKAGES = [
  'contentful-ui-extensions-sdk',
  '@contentful/ui-extensions-sdk',
  'contentful-app-sdk',
  '@contentful/app-sdk',
]
```

Eleven days later (`a785854`, #493) that list was narrowed to two, and the README was changed
to recommend `@contentful/app-sdk`. Publishing four names meant four release surfaces and four
sets of npm metadata to keep coherent, for two names nobody was asked to use.

Alternatives considered:

- **Rename in place, publish only `@contentful/app-sdk`.** Rejected — strands the installed
  base, which is large and includes customer apps this team does not control.
- **Keep publishing all four names.** Rejected in #493 — quadruples the publish surface to
  defend specifiers no documentation pointed at.
- **`npm deprecate` the legacy name and stop publishing it.** Rejected — a deprecation warning
  does not make a pinned lockfile resolve a new specifier, so consumers would silently stop
  receiving fixes, including security fixes.

## Decision

Publish every release from this single source tree under exactly **two** npm package names, at
identical versions with identical contents:

| Package                        | Role                                                                     |
| ------------------------------ | ------------------------------------------------------------------------ |
| `@contentful/app-sdk`          | Current, recommended specifier — use in all new code, examples, and docs |
| `contentful-ui-extensions-sdk` | Legacy alias, retained indefinitely for installed-base compatibility     |

`contentful-ui-extensions-sdk` remains the `name` committed in `package.json`; the scoped name
is applied at publish time.

### Mechanism

semantic-release does not perform the publish. It is configured with `@semantic-release/npm`'s
`npmPublish: false`, so it determines the next version, writes `CHANGELOG.md`, commits, and
tags — then delegates publishing to `@semantic-release/exec`:

```json
{
  "verifyConditionsCmd": "node ./scripts/verify.js",
  "publishCmd": "npm run publish-all"
}
```

`scripts/publish.js` iterates the `PACKAGES` list in `scripts/shared.js`. For each name it
calls `setPackageName(name)` — which rewrites `package.json#name` on disk and re-runs
`npm install` — then runs `npm publish --access public --tag <tag>`. `restorePackageJson()`
runs in a `finally` to put the committed name back.

`scripts/verify.js` dry-runs each name during semantic-release's `verifyConditions` step. That
step runs _before_ the next version is known, and `npm publish --dry-run` fails if the version
already exists on the registry, so verify.js temporarily writes a version that cannot collide:
`0.0.0-verify.<timestamp>`.

The dist-tag is derived from the version rather than the branch: a version matching
`\d+\.\d+\.\d+-alpha\.\d+` publishes under `canary`, everything else under `latest`.

## Consequences

### What this enables

- Consumers pinned to `contentful-ui-extensions-sdk` continue to receive every feature and
  security fix with no migration and no code change, indefinitely.
- New consumers get a conventionally scoped, correctly named package.
- There is exactly one source tree, one build, one version number, and one changelog. Both
  names are published from the same artifacts in the same run, so they cannot drift in content
  — at the time of writing both resolve to `4.69.0` on the public registry.

### Trade-offs accepted

- **`package.json` is mutated mid-publish.** `setPackageName` writes the file with
  `JSON.stringify(packageJson)` — no indentation — and `restorePackageJson` rewrites it with
  two-space indentation and _no_ trailing newline. A crash between the two leaves a
  wrong-named, reformatted `package.json` in the tree. The restore is the publish path's own
  cleanup, not a general safety net: manual edits to `name` are not protected, which is why
  `AGENTS.md` carries an explicit "never edit `name` directly" rule. (`scripts/verify.js`
  appends a trailing newline when it rewrites the file; `restorePackageJson` does not.)
- **The committed canonical name is the legacy one.** Any tool that reads
  `package.json#name` — dependency graphs, provenance metadata, registry dashboards — reports
  the deprecated specifier rather than the recommended one, so descriptions elsewhere have to
  compensate by naming both (`catalog-info.yaml` does exactly this).
- **The publish surface is doubled.** `publish.js` publishes sequentially and throws on the
  first failure, so a failure on the second name leaves the release published under one name
  only, at a version already tagged in git. Recovery is manual.
- **`verifyConditions` needs a throwaway version.** The `0.0.0-verify.<timestamp>` workaround
  exists solely because the dry-run happens before versioning; it is load-bearing, not
  incidental.
- **The scoped name adds registry-routing coupling the unscoped name does not have.** The
  release workflow writes an `.npmrc` mapping `@contentful` to GitHub Packages, and the
  ordering of that write relative to `npm ci` is load-bearing: applying it before install
  broke the release under npm 12, since lockfile URLs point at the public registry
  (`6021e29`, #2629).
- **Every piece of documentation must state which name to prefer**, because both are valid,
  current, and identical. The README, `AGENTS.md`, and `ARCHITECTURE.md` each carry that
  disambiguation.

### Follow-up work

- **No sunset criteria are recorded for the legacy name.** Neither the README nor `AGENTS.md`
  states what would have to be true to stop publishing `contentful-ui-extensions-sdk`. "Retained
  indefinitely" is the de facto policy; if that is intentional it should be stated, and if it is
  not, the conditions for retiring it should be written down.
- `restorePackageJson` could write the file byte-identically to what is committed — two-space
  indentation plus a trailing newline — so an interrupted publish leaves no spurious diff.
