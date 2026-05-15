# Architecture review guidelines — `ui-extensions-sdk`

Refer reviewers to [ARCHITECTURE.md](../../ARCHITECTURE.md) for the full picture. Flag PRs that violate these:

## Boundaries

- **PostMessage is the only host transport.** Flag any new `fetch`, `XMLHttpRequest`, direct `window.location` mutation, or DOM access for cross-frame use that bypasses `lib/channel.ts`. CMA calls must route through `lib/cmaAdapter.ts` (the channel-backed adapter), never a directly-instantiated `contentful-management` client.
- **Public types are a contract.** Any change to `lib/types/index.ts` or its re-exports is a breaking change unless purely additive (new fields on existing interfaces are also breaking — they widen the producer side). Flag PRs that:
  - Remove a public export
  - Rename a public type, interface, or method
  - Change a method signature in a non-additive way
  - Add a required field to an interface that consumers implement
  Without an accompanying `feat!:` commit and `BREAKING CHANGE:` footer in the squash-merge body.
- **Locations are additive.** New locations require updates to all five touch points: `lib/locations.ts`, `lib/types/api.types.ts` (new SDK type + `Locations` interface + `KnownAppSDK` union), `lib/api.ts` (`LOCATION_TO_API_PRODUCERS`), a producer factory if needed, and a unit test. Flag any PR that updates fewer than these.
- **`lib/space.ts` is frozen.** Flag any PR that adds methods to `lib/space.ts` — that API is deprecated since v4.0.0 (every method emits a `console.warn` recommending the CMA client). New CMA-backed work goes via `sdk.cma`.

## Module patterns

- **One module per public capability.** New top-level capabilities go in their own `lib/<name>.ts` with types in `lib/types/<name>.types.ts`. Don't extend `lib/api.ts` with new method bodies — `api.ts` is a router, not a hub.
- **Memoized signals for state, plain signals for events.** Use `MemoizedSignal` in `lib/signal.ts` when subscribers need the latest value on subscribe; use `Signal` for one-shot events. Flag deviations.
- **Producer functions get `(channel, data, currentGlobal)` only.** Don't pass additional state into producers — the channel is the source of truth. Flag any producer with a different signature.

## Build / deps

- **Bundle size budget.** PRs that change `lib/` must show a `npm run size` delta. Flag PRs that grow gzipped size without justification.
- **No new runtime dependencies** without explicit team review of the size cost and alternatives considered. `contentful-management` is currently the only runtime dependency.
- **No ESM-only deps.** The bundle is UMD-target ES5; ESM-only deps will fail at build time or require Rollup config gymnastics.
