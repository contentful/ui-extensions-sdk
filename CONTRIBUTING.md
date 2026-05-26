# Contributing to `ui-extensions-sdk`

This repo builds the **App SDK** and publishes it as `@contentful/app-sdk` (preferred) and `contentful-ui-extensions-sdk` (legacy alias). Local development, tests, and PR conventions below all describe work *in this repo*.

## Prerequisites

| Tool | Version | Source |
|---|---|---|
| Node.js | 24.11.0 (local), 22 or 24 (CI matrix) | `.nvmrc`, `.github/workflows/ci.yaml` |
| npm | bundled with Node | — |
| Git | any recent | — |

If you use `nvm`, `nvm use` picks up `.nvmrc`.

## Getting started

```bash
git clone git@github.com:contentful/ui-extensions-sdk.git
cd ui-extensions-sdk
npm ci
```

`npm ci` (not `install`) because the lockfile is the source of truth and CI uses `ci`.

The repo has an `.npmrc` with `ignore-scripts=true` for security — postinstall scripts in transitive dependencies will not run. This is intentional. Do not change it.

## Dev workflow

| Want to… | Run |
|---|---|
| Run unit tests | `npm test` |
| Type-check only | `npm run check-types` |
| Lint | `npm run lint` |
| Lint + autofix | `npm run lint:fix` |
| Build a release bundle | `npm run build` |
| Build with sourcemaps | `npm run build:debug` |
| Check gzipped bundle size | `npm run size` (requires a prior `build`) |

CI runs `lint → test → build → size` in that order on every PR (`.github/workflows/ci.yaml`). Match that locally before opening a PR.

A pre-commit hook (`.husky/pre-commit`) runs `lint-staged` over your staged files: `prettier --write` + `eslint --fix` on `.ts`, `prettier --write` on `.md`. Don't bypass with `--no-verify` unless the hook itself is broken.

## Testing

```bash
npm test
```

- Runner: **Mocha** via `ts-mocha` (NOT Jest, NOT Vitest)
- Assertions: **Chai** + `chai-as-promised`
- Mocking: **Sinon** + `sinon-chai`
- DOM simulation: **jsdom** (used heavily in `channel`, `signal`, `window` tests)
- Test files live at `test/unit/<module>.spec.ts` — one file per `lib/<module>.ts`
- Reusable test helpers: `test/helpers.ts` (`makeDOM`, `mockMutationObserver`, `mockResizeObserver`, `describeAttachHandlerMember`, `describeChannelCallingMethod`)
- Mock fixtures: `test/mocks/connectMessage.ts` for the host's connect-message shape

Reports are written to `test/unit/reports/test-results.xml` (JUnit XML, configured in `mocha.unit-reporters.json`). CI uploads them as the `test-results-node-{version}` artifact.

## Code style

- **TypeScript only** in `lib/`. No `.js` files there.
- **`strict: true`** is on (`tsconfig.json`). Don't introduce `any` in public types — use `unknown` if necessary, and explicit types everywhere else.
- **No new runtime dependencies** without strong justification. The repo currently has exactly one (`contentful-management`); adding another should be a deliberate, reviewed decision.
- **Prettier**: 100-col, single quotes, no semicolons, JSX bracket same line. Config in `.prettierrc`.
- **ESLint**: `standard` + Prettier integration + `@typescript-eslint`. Notable rules: `no-var: error`, `prefer-const: error`, `@typescript-eslint/no-unused-vars: error`.
- **One test file per module**: `lib/foo.ts` ↔ `test/unit/foo.spec.ts`.
- **Public types are exported from `lib/types/index.ts` only** — don't add additional barrel re-exports elsewhere.

## Commit conventions

Conventional Commits, validated at PR-title level (`.github/semantic.yml#titleOnly: true` — PRs are squash-merged so only the title matters). Examples in CHANGELOG.md.

| Prefix | Use for | Triggers release? |
|---|---|---|
| `feat:` | new public API or capability | minor |
| `fix:` | bug fix in published code | patch |
| `chore:` | tooling, config, CI, docs-only | **no** (skipped by semantic-release) |
| `docs:` | README/CONTRIBUTING/etc. | **no** |
| `refactor:` | internal-only restructuring | **no** |

**Breaking changes:** include a `BREAKING CHANGE:` footer in the squash-merge body. The `feat!:` shorthand alone is *not* sufficient — the analyzer needs the footer to bump major. Public types are part of the contract; renaming or removing an export is a breaking change.

## Branch strategy

- **`main`** — default branch; `latest` releases come from here.
- **`canary`** — alpha pre-release branch. Reset to `main`, branch off, PR into `canary`. Publishes `X.Y.Z-alpha.N` under the `canary` dist-tag.
- **Feature branches** — open against `main`, name freely. PRs are squash-merged.

Branch protection on `main`:
- 1 required approving review
- CODEOWNERS review required
- Stale reviews dismissed on new pushes
- Strict status-check matching
- No force-push, no branch deletion

## Pull requests

1. PR title is the squash-merge commit message — write a Conventional Commits title with a Jira key in brackets where applicable, e.g. `feat: short summary of the change [TICKET-1234]`.
2. Body follows `.github/PULL_REQUEST_TEMPLATE.md` (purpose + checklist).
3. Two approvers may be required if your change crosses both team-extensibility and team-marketplace concerns (CODEOWNERS lists both).
4. CI must be green; size check is part of CI.

## Release process

Fully automated via `semantic-release`. Do not hand-edit `package.json#version`, the changelog, or git tags.

```
PR merged to main
  → ci.yaml runs (Node 22 + 24)
  → if green, release.yaml triggers
    → HashiCorp Vault provisions a short-lived npm token (trusted publishing)
    → semantic-release calculates next version from commit messages
    → scripts/publish.js publishes contentful-ui-extensions-sdk
    → scripts/publish.js publishes @contentful/app-sdk (same version)
    → CHANGELOG.md updated, tag pushed, GitHub release created
```

Pre-publish dry-run runs in `verifyConditions` via `scripts/verify.js`, which uses a unique `0.0.0-verify.<timestamp>` version to avoid clashing with already-published versions during the dry-run.

**Canary releases:** push to `canary`. The same release pipeline runs but emits `X.Y.Z-alpha.N` under the `canary` dist-tag. Install with `npm install @contentful/app-sdk@canary`.

## Dependabot

- Schedule: daily, with a 15-day cooldown before merging a freshly published version (defense against compromised packages).
- Groups: `production-dependencies` and `dev-dependencies`, both for minor/patch updates.
- Auto-merge: dev minor/patch via `contentful/github-auto-merge@v1`.
- Pinned ignores: `framer-motion >=8.0.0` (not used here, inherited config), `semantic-release >=25.0.0` was previously pinned but the repo is now on 25.x.

## Getting help

- **CI alerts** route to `#prd-extensibility-bots` (per `catalog-info.yaml`).
- **Owning teams**: `@contentful/team-extensibility` and `@contentful/team-marketplace` (per CODEOWNERS).
- **Customer-facing reference**: [Contentful Docs — App SDK Reference](https://www.contentful.com/developers/docs/extensibility/app-framework/sdk/).

## Troubleshooting

| Symptom | Likely cause / fix |
|---|---|
| `npm ci` fails with peer-dep errors | `contentful-management` major may have shifted — check git log for recent `feat: bump contentful-management` commits |
| Type errors after pull | A dep updated; run `npm ci` |
| `dist/` is stale or missing | Run `npm run build` |
| Tests in `channel.spec.ts` / `signal.spec.ts` / `window.spec.ts` fail with `MutationObserver is not defined` | jsdom isn't set up — check `test/helpers.ts` import or run `npm ci` |
| Bundle size CI check fails | `npm run size` locally to see the gzipped bytes — likely an unintentional dep import in `lib/` |
| Pre-commit hook hangs | `lint-staged` is iterating large staged files; commit smaller diffs |
