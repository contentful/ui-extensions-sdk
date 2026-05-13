# Quality review guidelines — `ui-extensions-sdk`

## Tests

- **One unit test file per module.** `lib/foo.ts` ↔ `test/unit/foo.spec.ts`. Flag PRs adding a `lib/<file>.ts` without `test/unit/<file>.spec.ts`.
- **Use shared helpers.** `test/helpers.ts` provides `mockMutationObserver`, `mockResizeObserver`, `describeAttachHandlerMember`, `describeChannelCallingMethod`. Reach for these before reimplementing patterns.
- **Use mocks from `test/mocks/`.** `connectMessage.ts`, `agent.ts`, `entries.ts`, `environments.ts`, `releases.ts` are the canonical fixtures. Don't redefine `ConnectMessage` shapes inline.
- **Assertion library is Chai.** Don't introduce `expect`-from-other-libraries. Don't use `chai`'s `should` style — `expect` is the convention.
- **No skipped or `.only`'d tests.** Flag any `describe.only`, `it.only`, `describe.skip`, or `it.skip` outside of a draft PR.

## TypeScript

- **No `any` in public types.** `lib/types/**/*.ts` and any exported type from `lib/index.ts` must be explicit. `unknown` is acceptable when the value's shape is genuinely unknowable. Internal `any` for legacy seams is acceptable but should be commented.
- **`strict: true`** is enforced. Don't disable strict per-file with `// @ts-nocheck` or per-line with `@ts-ignore`. Use `@ts-expect-error` with a comment if absolutely necessary (the codebase has a few in `lib/utils/deferred.ts`).
- **Public types live in `lib/types/`** and are re-exported from `lib/types/index.ts` only. Don't add additional barrel files.

## Style

- **Prettier and ESLint are CI gates.** Don't disable rules without justification. The two notable enforced rules: `no-var: error`, `prefer-const: error`.
- **One concern per PR.** Flag PRs that mix dependency bumps with feature work or refactors. Squash-merge means everything in the PR ships under one commit message.

## Commits / PRs

- **Conventional Commits at PR-title level.** `.github/semantic.yml` enforces this. Common prefixes: `feat:`, `fix:`, `chore:`, `docs:`. Use `chore:` only for changes that should NOT trigger a release (tooling, config); use `fix:` or `feat:` for any user-facing change so semantic-release does not skip it.
- **Jira key in the title.** Pattern: `feat: short summary [EXT-1234]`. Look for it; flag if missing on a non-trivial PR.
- **`BREAKING CHANGE:` footer for breaking changes.** The `feat!:` shorthand is *not* sufficient with the current `conventional-commits-parser` v6 + `commit-analyzer` v13 — the footer is required. Flag any PR that signals breaking-ness with `!` alone.

## Files reviewers should ignore

- `dist/**`, `docs/cf-*`, `docs/styleguide/**` — generated and legacy artifacts
- `package-lock.json` — review-noise
- `CHANGELOG.md` — semantic-release owns it

(These are also in `.bito.yaml#review.ignore_paths`.)
