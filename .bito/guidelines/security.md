# Security review guidelines — `ui-extensions-sdk`

This SDK ships to thousands of customer apps via npm and CDN. Treat security feedback as priority.

## Dependencies

- **No new runtime dependency without strong justification.** Every runtime dep extends the supply-chain reach to every consumer. Flag any PR that adds to `package.json#dependencies` without explicit team review (see `.bito/guidelines/architecture.md`).
- **Dev dependencies are also supply chain.** Dependabot has a 15-day cooldown configured (`.github/dependabot.yml`) precisely to give time to detect compromised packages. Flag dev-dep additions that pin a version under that 15-day window.
- **`.npmrc` security stance is locked.** Specifically `ignore-scripts=true` (supply-chain hardening — prevents lifecycle scripts in transitive deps from running on install). Flag any PR that touches `.npmrc` to ensure this is preserved.

## Secrets / tokens

- **No hardcoded secrets.** The repo does not use any secrets at runtime — release tokens come from HashiCorp Vault during the publish workflow. Flag any commit that introduces literal API keys, tokens, or webhook URLs.
- **Release pipeline uses trusted publishing.** Don't replace the Vault-action with long-lived tokens (`secrets.NPM_TOKEN`-style). The current pipeline uses `hashicorp/vault-action` to mint short-lived tokens (`.github/workflows/release.yaml`).

## PostMessage / iframe boundary

- **Don't widen the host trust surface.** The SDK currently treats *any* `connect` message from any origin as authoritative (`lib/channel.ts:waitForConnect`) — the security model relies on the iframe sandbox + the host's PostMessage hygiene. Flag any change that:
  - Adds new `params` fields without input shape validation in TypeScript types
  - Sends sensitive data outbound on `postMessage(*, '*')` without verifying the destination
  - Introduces eval'd or `Function`-constructed code on the SDK side
- **`DataCloneError` handling is intentional.** `channel.ts:111-116` catches DataCloneError specifically for `openDialog` and emits a customer-helpful message. Don't replace with generic error suppression.

## CI / branch protection

- **Branch protection on `main`.** 1 required approving review, code-owner review required, stale reviews dismissed on push, strict status checks. Flag any PR that proposes loosening these.
- **CODEOWNERS is enforced.** Both `team-extensibility` and `team-marketplace` are listed. PRs touching `.github/CODEOWNERS` should be reviewed for ownership impact.
- **No `--no-verify` on commits.** Pre-commit `lint-staged` is part of the security/quality gate. Flag PRs whose body or commit messages indicate `--no-verify` was used.
