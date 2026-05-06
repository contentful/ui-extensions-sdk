# Contributing to contentful-ui-extensions-sdk / @contentful/app-sdk

## Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 18 (`.nvmrc`) |
| npm | bundled with Node |

## Setup

```bash
git clone https://github.com/contentful/ui-extensions-sdk.git
cd ui-extensions-sdk
npm ci
```

## Running Tests

```bash
npm test
```

Tests use **Mocha + ts-mocha** (not Vitest). Test files are in `test/unit/*.spec.ts`. Results are written to `test/unit/reports/` as JUnit XML.

## Building

```bash
npm run build
```

Compiles TypeScript and bundles with Rollup. Output goes to `dist/`. Run `npm run build:debug` for a build with source maps.

## Type Checking

```bash
npm run check-types
```

Run this before every PR — type errors in a types library are blocking. It's faster to catch locally than in CI.

## Linting

```bash
npm run lint
```

ESLint on `lib/` and `test/`.

## Bundle Size Check

```bash
npm run size
```

Checks gzip size of `dist/cf-extension-api.js`. CI fails if the size limit is exceeded. Run after adding new code or dependencies.

## Code Conventions

- **TypeScript only** — no plain `.js` files in `lib/`
- **No `any`** — use explicit types or `unknown`
- **No new production dependencies** without strong justification — the SDK must stay lean
- **Conventional Commits** — `feat:`, `fix:`, `chore:`, `docs:`
- **One test file per module** — `lib/foo.ts` → `test/unit/foo.spec.ts`

## Releasing

Releases are fully automated via semantic-release on the `master` branch. Do not manually bump versions or publish.

**Canary releases**: Merge to the `canary` branch. CI publishes `X.Y.Z-alpha.N` under the `canary` npm dist-tag. Install with:
```bash
npm install @contentful/app-sdk@canary
```

## Branch Strategy

- **`master`** — production; triggers semantic-release on merge
- **`canary`** — prerelease; publishes canary versions
- **Feature branches** — PR against `master`

## Troubleshooting

**Type errors after pulling**
Run `npm ci` — a dependency may have been updated.

**`dist/` is stale**
Run `npm run build` to regenerate.

**Test failures in `channel` or `signal` modules**
These depend on jsdom for PostMessage simulation. Ensure `npm ci` has been run and jsdom is installed.
