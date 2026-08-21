# Architecture Decision Records

Each ADR records a single architectural decision, the context that forced it, and the
consequences this repository now lives with. They are historical records — an accepted ADR is
not edited to reflect later changes. When a decision is reversed, add a new ADR and mark the
old one `Superseded by`.

| Date                                                                 | Status   | Title                                               |
| -------------------------------------------------------------------- | -------- | --------------------------------------------------- |
| [2021-01-15](./2021-01-15-publish-one-source-under-two-npm-names.md) | Accepted | Publish one source tree under two npm package names |

## Conventions

- **Filename** — `YYYY-MM-DD-short-title.md`. The date is the date of the decision, taken from
  the commit, pull request, or discussion that made it — not the date the ADR was written. The
  filename is the canonical identifier; there is no separate sequential numbering.
- **Sections** — `Status`, `Context`, `Decision`, `Consequences`.
- **Status** — one of `Accepted`, `Deprecated`, or
  `Superseded by [YYYY-MM-DD-title](./YYYY-MM-DD-title.md)`.
- **One decision per record.** Corrections and follow-ups that flow from a decision belong in
  that decision's `Consequences`, not in new ADRs.
- **Cite evidence.** Reference commits and pull requests in this repository so a reader can
  verify the reasoning. Verify commit hashes against `git log` before writing them. This
  repository is public — cite only publicly visible sources.

> **Note on location:** these records live under `docs/` because that is where decision records
> are expected to be found. Everything else in `docs/` is legacy GitHub Pages content — see
> [`../WARNING.txt`](../WARNING.txt). Adding files here is additive and does not affect the
> paths that content is served from.
