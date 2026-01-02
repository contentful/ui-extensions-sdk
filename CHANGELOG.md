# [4.49.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.48.2...v4.49.0) (2026-01-02)

### Bug Fixes

- add vault step to release github action to retrieve token for version bump in git [EXT-7068] ([#2398](https://github.com/contentful/ui-extensions-sdk/issues/2398)) ([c913680](https://github.com/contentful/ui-extensions-sdk/commit/c913680e3a83a513c0556cf52cf693719e5f2dcf))
- bump patch [EXT-7068] ([#2411](https://github.com/contentful/ui-extensions-sdk/issues/2411)) ([6c4676a](https://github.com/contentful/ui-extensions-sdk/commit/6c4676ab5d68159954f5de877bcb1b37a91e18b1))
- **ci:** auth actions/checkout as bot because it is used for subsequent ops [MEC-2423] ([#2418](https://github.com/contentful/ui-extensions-sdk/issues/2418)) ([d16e9ce](https://github.com/contentful/ui-extensions-sdk/commit/d16e9ce40c12377da93a88b52146821aa4938071))
- MEC-2423 fix CI actor ([bcc1338](https://github.com/contentful/ui-extensions-sdk/commit/bcc1338b79f2fe72c519fd7860101b3609b30612))
- MEC-2423 fix npm publishing ([22890e5](https://github.com/contentful/ui-extensions-sdk/commit/22890e5dffb63b9d90c91b58cc591ff6a0288bf5))
- MEC-2423 fix release pipeline ([a5bd8b8](https://github.com/contentful/ui-extensions-sdk/commit/a5bd8b8908889d072c9d476424b17fe613129abe))
- MEC-2423 fix token passing for release ([#2417](https://github.com/contentful/ui-extensions-sdk/issues/2417)) ([6e95291](https://github.com/contentful/ui-extensions-sdk/commit/6e95291c73ee97023e975b2f246c5d6994787f0a))
- release job [EXT-7068] ([#2400](https://github.com/contentful/ui-extensions-sdk/issues/2400)) ([bea6ede](https://github.com/contentful/ui-extensions-sdk/commit/bea6eded64c3716aee85af52ab214ec3765dd1da))
- remove npm token check since now we use oidc [EXT-7067] ([#2397](https://github.com/contentful/ui-extensions-sdk/issues/2397)) ([22389d0](https://github.com/contentful/ui-extensions-sdk/commit/22389d08fdfba8b5f2c701897847e6ff59329728))
- use correct vault-github-actions tag [EXT-7068] ([#2399](https://github.com/contentful/ui-extensions-sdk/issues/2399)) ([8fb861a](https://github.com/contentful/ui-extensions-sdk/commit/8fb861a9476fcdb483f45d21bd7cd141c686a3c1))

### Features

- implement trusted publishing for npm releases and remove custom codeql workflow [EXT-7067] ([#2384](https://github.com/contentful/ui-extensions-sdk/issues/2384)) ([1f6b45b](https://github.com/contentful/ui-extensions-sdk/commit/1f6b45bb94f929180c4887b21a463c8237e4d73f))

## [4.48.2](https://github.com/contentful/ui-extensions-sdk/compare/v4.48.1...v4.48.2) (2025-12-11)

### Bug Fixes

- swap AIChatLayout variant enum order [EXT-7067] ([#2389](https://github.com/contentful/ui-extensions-sdk/issues/2389)) ([86434d0](https://github.com/contentful/ui-extensions-sdk/commit/86434d0274399f64512b4166d55163a6a18a993e))

## [4.48.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.48.0...v4.48.1) (2025-12-10)

### Bug Fixes

- manually run build from semantic release to fix circle ci issues [EXT-7067] ([#2382](https://github.com/contentful/ui-extensions-sdk/issues/2382)) ([1c6a0e0](https://github.com/contentful/ui-extensions-sdk/commit/1c6a0e0c95ab0110fe04acbfbb03649ad8e44798))

# [4.48.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.47.0...v4.48.0) (2025-12-10)

### Features

- Restore onLayoutVariantChange to AgentAPI [EXT-7067] ([#2381](https://github.com/contentful/ui-extensions-sdk/issues/2381)) ([11f4b69](https://github.com/contentful/ui-extensions-sdk/commit/11f4b692141bdb211f611647cbf87877a52af641))

# [4.47.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.46.0...v4.47.0) (2025-11-14)

### Features

- add window api for agent location [EXT-6968] ([#2372](https://github.com/contentful/ui-extensions-sdk/issues/2372)) ([9493f72](https://github.com/contentful/ui-extensions-sdk/commit/9493f720f59afcf7bd96bd9b1f91a320e1ff1a7c))

# [4.46.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.45.0...v4.46.0) (2025-11-11)

### Bug Fixes

- bump CircleCI Node version to 24.11.0 [] ([#2365](https://github.com/contentful/ui-extensions-sdk/issues/2365)) ([e054b06](https://github.com/contentful/ui-extensions-sdk/commit/e054b06c278f9e953d30b51f1dddf386dccbf468))
- **deps:** downgrade semantic-release and related dependencies ([#2366](https://github.com/contentful/ui-extensions-sdk/issues/2366)) ([d27fde3](https://github.com/contentful/ui-extensions-sdk/commit/d27fde355ab51701b5b84d9dd899294698180950))

### Features

- **api:** add agent location and API integration [EXT-6966] ([#2362](https://github.com/contentful/ui-extensions-sdk/issues/2362)) ([2febd54](https://github.com/contentful/ui-extensions-sdk/commit/2febd5466551bbcd8f3f032af7967e88179a21d7))

# [4.45.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.44.1...v4.45.0) (2025-09-24)

### Features

- ext 6788 asset sidebar location constants [EXT-6786] ([#2338](https://github.com/contentful/ui-extensions-sdk/issues/2338)) ([87ab2b1](https://github.com/contentful/ui-extensions-sdk/commit/87ab2b112a2cb668f6eb52644361912539382d05))

## [4.44.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.44.0...v4.44.1) (2025-09-18)

### Bug Fixes

- made functions optional until implementation [SPA-3218] ([#2333](https://github.com/contentful/ui-extensions-sdk/issues/2333)) ([89109a2](https://github.com/contentful/ui-extensions-sdk/commit/89109a274ca66d6332ea3a65f4a5cd48e48d09dc))

# [4.44.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.43.0...v4.44.0) (2025-09-17)

### Features

- add uiLanguageLocale to API ([#2328](https://github.com/contentful/ui-extensions-sdk/issues/2328)) ([cbf6bba](https://github.com/contentful/ui-extensions-sdk/commit/cbf6bba479c568baed411e369e9daa6ecd2072b9))

# [4.43.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.42.0...v4.43.0) (2025-09-12)

### Features

- bump CMA version ([#2325](https://github.com/contentful/ui-extensions-sdk/issues/2325)) ([7b44b0d](https://github.com/contentful/ui-extensions-sdk/commit/7b44b0d4d2b23a1584097d513b1bf99b685a21e0))

# [4.42.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.41.2...v4.42.0) (2025-09-11)

### Features

- update appActionCall to use new methods [EXT-6593] ([#2318](https://github.com/contentful/ui-extensions-sdk/issues/2318)) ([54194b4](https://github.com/contentful/ui-extensions-sdk/commit/54194b40afe3b1a492c4c4cbe6eef485bd6d338f))

## [4.41.2](https://github.com/contentful/ui-extensions-sdk/compare/v4.41.1...v4.41.2) (2025-09-05)

### Bug Fixes

- added support for types Experience, Pattern and ComponentDefinition [SPA-3128] ([#2320](https://github.com/contentful/ui-extensions-sdk/issues/2320)) ([41ccac0](https://github.com/contentful/ui-extensions-sdk/commit/41ccac01b99109c0a12b14e27dc2b8db3f9c0109))

## [4.41.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.41.0...v4.41.1) (2025-08-18)

### Bug Fixes

- **api.types:** make release field optional in IdsAPI interface [] ([#2314](https://github.com/contentful/ui-extensions-sdk/issues/2314)) ([4905969](https://github.com/contentful/ui-extensions-sdk/commit/4905969fbbf261c506f9928b9872ed6b145eecad))

# [4.41.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.40.0...v4.41.0) (2025-08-07)

### Features

- **cma:** add releaseId to CMAClient parameters [EXT-6580] ([#2312](https://github.com/contentful/ui-extensions-sdk/issues/2312)) ([18869bb](https://github.com/contentful/ui-extensions-sdk/commit/18869bb42d2fb122c3dbce8697f6a5b9a451bc5d))

# [4.40.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.39.0...v4.40.0) (2025-08-06)

### Features

- streamline release handling in navigation methods [EXT-6551] ([#2311](https://github.com/contentful/ui-extensions-sdk/issues/2311)) ([6ab1fdf](https://github.com/contentful/ui-extensions-sdk/commit/6ab1fdf8c59ea2dc4799f7686fda8ae1150452d6))

# [4.39.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.38.0...v4.39.0) (2025-08-04)

### Features

- **navigator:** add entityInRelease flag to NavigatorAPIOptions [EXT-6551] ([#2305](https://github.com/contentful/ui-extensions-sdk/issues/2305)) ([96c3899](https://github.com/contentful/ui-extensions-sdk/commit/96c3899e26f2c579519450157a77f5effcc00908))

# [4.38.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.37.0...v4.38.0) (2025-08-04)

### Features

- **navigator:** enhance navigation methods to include releaseId [EXT_6551] ([#2303](https://github.com/contentful/ui-extensions-sdk/issues/2303)) ([c8ceb35](https://github.com/contentful/ui-extensions-sdk/commit/c8ceb350eab5312593a32a5f67b843d22fea14e2))

# [4.37.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.36.0...v4.37.0) (2025-07-31)

### Features

- Add entityInRelease back to navigateToContentEntity channel message object [EXT-6551] ([#2301](https://github.com/contentful/ui-extensions-sdk/issues/2301)) ([7769383](https://github.com/contentful/ui-extensions-sdk/commit/7769383e51e1b7aad960b12503892a3cc447c64b))

# [4.36.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.35.0...v4.36.0) (2025-07-28)

### Features

- update navigator open entry method [EXT-6551] ([#2299](https://github.com/contentful/ui-extensions-sdk/issues/2299)) ([84183c1](https://github.com/contentful/ui-extensions-sdk/commit/84183c13cb5b769c210b30f8dba89b002a2f2d3c))

# [4.35.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.34.0...v4.35.0) (2025-07-25)

### Features

- api, navigator): add optional release parameter to createNavigator so openEntry method could work properly. ([#2297](https://github.com/contentful/ui-extensions-sdk/issues/2297)) ([2f0aedf](https://github.com/contentful/ui-extensions-sdk/commit/2f0aedf4d80325ad3ea4bc87f48f041da0d5a04c))

# [4.34.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.33.0...v4.34.0) (2025-07-21)

### Features

- bump version for deploy [] ([#2292](https://github.com/contentful/ui-extensions-sdk/issues/2292)) ([b6f0d17](https://github.com/contentful/ui-extensions-sdk/commit/b6f0d17d83f6f0696e10ad651fde2adea36d53f9))

# [4.33.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.32.0...v4.33.0) (2025-07-21)

### Features

- bump to deploy [] ([#2291](https://github.com/contentful/ui-extensions-sdk/issues/2291)) ([6d095f3](https://github.com/contentful/ui-extensions-sdk/commit/6d095f302d0c2d79fef8fb8c2b89957a51606ad5))

# [4.32.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.31.0...v4.32.0) (2025-07-16)

### Features

- **api:** add release parameter to entry API and update createEntry [EXT-6548] ([#2284](https://github.com/contentful/ui-extensions-sdk/issues/2284)) ([73dabf5](https://github.com/contentful/ui-extensions-sdk/commit/73dabf5b76d8a84592e52063a8392ddbffca4803))

# [4.31.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.30.0...v4.31.0) (2025-07-15)

### Features

- passed the release obj to the shared api instead of just the entry api so dialogs and navigator could have access to this value ([fd8ea6f](https://github.com/contentful/ui-extensions-sdk/commit/fd8ea6f380bb4fc6a77d37d3de0a4769930a0251))

# [4.30.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.29.7...v4.30.0) (2025-07-15)

### Bug Fixes

- npm-ci-syncing-issue [] ([#2283](https://github.com/contentful/ui-extensions-sdk/issues/2283)) ([ae777e5](https://github.com/contentful/ui-extensions-sdk/commit/ae777e503503e1cd1cd8abf7a37a00dbc74d5103))

### Features

- **api:** !!DO NOT MERGE !! add release property to ConnectMessage and API responses [EXT-6546] ([#2281](https://github.com/contentful/ui-extensions-sdk/issues/2281)) ([9758d6d](https://github.com/contentful/ui-extensions-sdk/commit/9758d6dbbac9065d1dccb62cdc419180371f9ae7))

## [4.29.7](https://github.com/contentful/ui-extensions-sdk/compare/v4.29.6...v4.29.7) (2025-05-28)

### Bug Fixes

- internal fixes [EXT-6372] ([#2249](https://github.com/contentful/ui-extensions-sdk/issues/2249)) ([8e2805a](https://github.com/contentful/ui-extensions-sdk/commit/8e2805aa2ca08c7456581e1a549b38211781e618))

## [4.29.6](https://github.com/contentful/ui-extensions-sdk/compare/v4.29.5...v4.29.6) (2025-04-09)

### Bug Fixes

- force new release with updated contentful-management [] ([#2209](https://github.com/contentful/ui-extensions-sdk/issues/2209)) ([2945e6a](https://github.com/contentful/ui-extensions-sdk/commit/2945e6a4a6fa4e3f6d17311af1d7ce88f7c42a51))

## [4.29.5](https://github.com/contentful/ui-extensions-sdk/compare/v4.29.4...v4.29.5) (2025-01-27)

### Bug Fixes

- force release to fix type conflicts with old contentful-management ([#2130](https://github.com/contentful/ui-extensions-sdk/issues/2130)) ([c82b4e1](https://github.com/contentful/ui-extensions-sdk/commit/c82b4e1b19ca7d492d42fb319f17d35f7c80605a))

## [4.29.3](https://github.com/contentful/ui-extensions-sdk/compare/v4.29.2...v4.29.3) (2024-11-05)

### Bug Fixes

- remove .npmrc at root to fix publish registry [EXT-5905] ([#2064](https://github.com/contentful/ui-extensions-sdk/issues/2064)) ([b3174ec](https://github.com/contentful/ui-extensions-sdk/commit/b3174ecff2efaef32ab04236e4d629408a11a182))

## [4.29.2](https://github.com/contentful/ui-extensions-sdk/compare/v4.29.1...v4.29.2) (2024-10-30)

### Bug Fixes

- release dependabot updates [] ([#2058](https://github.com/contentful/ui-extensions-sdk/issues/2058)) ([8ef81a9](https://github.com/contentful/ui-extensions-sdk/commit/8ef81a9bce8299dea8836e621cd8a7e31e2e9c72))

## [4.29.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.29.0...v4.29.1) (2024-08-15)

### Bug Fixes

- upgrade contentful-management to include axios vuln fix ([#2002](https://github.com/contentful/ui-extensions-sdk/issues/2002)) ([a9d2831](https://github.com/contentful/ui-extensions-sdk/commit/a9d283192a77ce55929588d301b247dbebcff38a))

# [4.29.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.28.0...v4.29.0) (2024-07-22)

### Bug Fixes

- husky pre-commit [] ([#1981](https://github.com/contentful/ui-extensions-sdk/issues/1981)) ([4d81c5a](https://github.com/contentful/ui-extensions-sdk/commit/4d81c5a77b940f6c7cf7d28a4f34650a8b587c2f))

### Features

- add type for cursor-based collection responses ([#1975](https://github.com/contentful/ui-extensions-sdk/issues/1975)) ([e912b7d](https://github.com/contentful/ui-extensions-sdk/commit/e912b7d93055a6f2527330beab040c98de23602e))

# [4.28.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.27.0...v4.28.0) (2024-07-08)

### Features

- export allowed resources error types ([#1962](https://github.com/contentful/ui-extensions-sdk/issues/1962)) ([d9feb5b](https://github.com/contentful/ui-extensions-sdk/commit/d9feb5bf390e328fbf972589830fe68f8a5f6ba7))

# [4.27.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.26.3...v4.27.0) (2024-07-08)

### Features

- add allowed resources error types ([#1957](https://github.com/contentful/ui-extensions-sdk/issues/1957)) ([d946440](https://github.com/contentful/ui-extensions-sdk/commit/d94644086667cb8f5dce72404191b4f9b7301d45))

## [4.26.3](https://github.com/contentful/ui-extensions-sdk/compare/v4.26.2...v4.26.3) (2024-07-02)

### Bug Fixes

- [] add NPM token to .npmrc in CI ([#1952](https://github.com/contentful/ui-extensions-sdk/issues/1952)) ([a16d1c7](https://github.com/contentful/ui-extensions-sdk/commit/a16d1c783a60571257113b6c184e487324c79315))

## [4.26.2](https://github.com/contentful/ui-extensions-sdk/compare/v4.26.1...v4.26.2) (2024-06-28)

### Bug Fixes

- whitespace [] ([#1949](https://github.com/contentful/ui-extensions-sdk/issues/1949)) ([e682d5b](https://github.com/contentful/ui-extensions-sdk/commit/e682d5b045e226a8ff7166ad9594ecbbd5c6c0b0))

## [4.26.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.26.0...v4.26.1) (2024-06-28)

### Bug Fixes

- non-compatible test deps [NONE] ([#1947](https://github.com/contentful/ui-extensions-sdk/issues/1947)) ([81546a1](https://github.com/contentful/ui-extensions-sdk/commit/81546a13671dff9a62ecfeb2a740ce7a27e68ea9))

# [4.26.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.25.0...v4.26.0) (2024-03-07)

### Features

- github migration [EXT-5010] ([#1852](https://github.com/contentful/ui-extensions-sdk/issues/1852)) ([36d924c](https://github.com/contentful/ui-extensions-sdk/commit/36d924c148691369278f5df7f2b3af9b911c4eaa))

# [4.25.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.24.0...v4.25.0) (2024-03-06)

### Features

- github migration [EXT-5010] ([#1851](https://github.com/contentful/ui-extensions-sdk/issues/1851)) ([aa29074](https://github.com/contentful/ui-extensions-sdk/commit/aa29074e98f06d9f7a364dbbae1475c3c970aaa1))

# [4.24.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.23.1...v4.24.0) (2024-01-19)

### Features

- add nodeType to SizeValidationError [DANTE-1114] ([#1807](https://github.com/contentful/ui-extensions-sdk/issues/1807)) ([735e915](https://github.com/contentful/ui-extensions-sdk/commit/735e915be699a2861bc5662c9edc6d5b53f39a9d))

## [4.23.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.23.0...v4.23.1) (2023-09-26)

### Bug Fixes

- node 18.18 for semantic release to work ([#1676](https://github.com/contentful/ui-extensions-sdk/issues/1676)) ([4336a35](https://github.com/contentful/ui-extensions-sdk/commit/4336a35d80553be168f473cc4730ecb6276ec38a))

# [4.23.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.22.1...v4.23.0) (2023-08-25)

### Features

- hostnames API ([#1633](https://github.com/contentful/ui-extensions-sdk/issues/1633)) ([e776ce4](https://github.com/contentful/ui-extensions-sdk/commit/e776ce44d8672c3e2355e373e58d790b8e9ef6d0))

## [4.22.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.22.0...v4.22.1) (2023-07-10)

### Bug Fixes

- [EXT-3666] Remove duplicating event dispatch ([#1565](https://github.com/contentful/ui-extensions-sdk/issues/1565)) ([c51f998](https://github.com/contentful/ui-extensions-sdk/commit/c51f9988fd48aa6a7416b46d53bcb1176396b89e))

# [4.22.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.21.1...v4.22.0) (2023-06-29)

### Features

- [EXT-3599] Bundle contentful-management with app-sdk. (Third attempt) ([#1560](https://github.com/contentful/ui-extensions-sdk/issues/1560)) ([78780b7](https://github.com/contentful/ui-extensions-sdk/commit/78780b715d7e7b4e94a3360a8cf339819c3789ab)), closes [#1548](https://github.com/contentful/ui-extensions-sdk/issues/1548)

# [4.22.0-alpha.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.21.1...v4.22.0-alpha.1) (2023-06-29)

### Features

- [EXT-3599] Bundle contentful-management with app-sdk. (Third attempt) ([#1560](https://github.com/contentful/ui-extensions-sdk/issues/1560)) ([78780b7](https://github.com/contentful/ui-extensions-sdk/commit/78780b715d7e7b4e94a3360a8cf339819c3789ab)), closes [#1548](https://github.com/contentful/ui-extensions-sdk/issues/1548)

## [4.21.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.21.0...v4.21.1) (2023-06-23)

### Bug Fixes

- revert expose cma in the sdk [EXT-3599] ([#1549](https://github.com/contentful/ui-extensions-sdk/issues/1549)) ([7b58c94](https://github.com/contentful/ui-extensions-sdk/commit/7b58c9403d4af01bc409b1a2e77ccac193ab9c20))

### Reverts

- expose cma in the sdk [EXT-3599] ([#1548](https://github.com/contentful/ui-extensions-sdk/issues/1548)) ([9b8684f](https://github.com/contentful/ui-extensions-sdk/commit/9b8684fec4694fc68f0971a3b0be8bb9c48c20f2))

# [4.21.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.20.0...v4.21.0) (2023-06-22)

### Features

- adds optional types for parameters [EXT-4381] ([#1538](https://github.com/contentful/ui-extensions-sdk/issues/1538)) ([7cbad71](https://github.com/contentful/ui-extensions-sdk/commit/7cbad718111ba830b0c75921c06bfae437515411))

# [4.20.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.19.1...v4.20.0) (2023-06-22)

### Features

- expose cma in the sdk [EXT-3599] ([#1536](https://github.com/contentful/ui-extensions-sdk/issues/1536)) ([942c5e0](https://github.com/contentful/ui-extensions-sdk/commit/942c5e0b98b651652a4c1fd5edcac3cd69ba0e9e))

## [4.19.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.19.0...v4.19.1) (2023-06-15)

### Bug Fixes

- [] Add boolean field type ([#1541](https://github.com/contentful/ui-extensions-sdk/issues/1541)) ([ba52bdf](https://github.com/contentful/ui-extensions-sdk/commit/ba52bdfc5a100348bc576ab6d0b13cfe17b36d47))

# [4.19.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.18.0...v4.19.0) (2023-06-14)

### Features

- [EXT-3648][EXT-4380] Improve sdk.field types ([#1529](https://github.com/contentful/ui-extensions-sdk/issues/1529)) ([ec0da5a](https://github.com/contentful/ui-extensions-sdk/commit/ec0da5a2ed399c18b1a479bcaa193cc480172c71))

# [4.18.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.17.2...v4.18.0) (2023-06-14)

### Features

- [EXT-3265] Add field name prop ([#1527](https://github.com/contentful/ui-extensions-sdk/issues/1527)) ([4477e90](https://github.com/contentful/ui-extensions-sdk/commit/4477e90734440c10586b13cda424a6f78512eb39))

## [4.17.2](https://github.com/contentful/ui-extensions-sdk/compare/v4.17.1...v4.17.2) (2023-05-17)

### Bug Fixes

- exposed createWithResponse function[] ([#1522](https://github.com/contentful/ui-extensions-sdk/issues/1522)) ([2255541](https://github.com/contentful/ui-extensions-sdk/commit/2255541c5e535c98a45977258fcea8a99b9fa1a7))

## [4.17.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.17.0...v4.17.1) (2023-04-05)

### Bug Fixes

- [] Deprecate XXXExtensionSDK types in favour of XXXAppSDK ([#1505](https://github.com/contentful/ui-extensions-sdk/issues/1505)) ([a8ee8e7](https://github.com/contentful/ui-extensions-sdk/commit/a8ee8e7a430fbc9e31392603b7f14f30fe307eab))

# [4.17.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.16.0...v4.17.0) (2023-03-29)

### Features

- **Entities:** add more supported entities to app sdk's cma [EXT-4359] ([#1501](https://github.com/contentful/ui-extensions-sdk/issues/1501)) ([43e6c96](https://github.com/contentful/ui-extensions-sdk/commit/43e6c96d5c94428a717b64d3b4c0edee4982e6e0))

# [4.16.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.15.0...v4.16.0) (2023-02-10)

### Features

- initial values & getters for field/editor API ([#1444](https://github.com/contentful/ui-extensions-sdk/issues/1444)) ([fa98f30](https://github.com/contentful/ui-extensions-sdk/commit/fa98f309293f794359e44ac2eda2178ad25c5e6f))

# [4.15.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.14.1...v4.15.0) (2023-02-06)

### Features

- expose automation tags on entry.sys [] ([#1468](https://github.com/contentful/ui-extensions-sdk/issues/1468)) ([a5cde02](https://github.com/contentful/ui-extensions-sdk/commit/a5cde02ee68012afbd898e442f65ca6a4f1e9410))

## [4.14.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.14.0...v4.14.1) (2022-12-29)

### Bug Fixes

- types of sdk.editor & sdk.navigator ([#1441](https://github.com/contentful/ui-extensions-sdk/issues/1441)) ([b514498](https://github.com/contentful/ui-extensions-sdk/commit/b514498ea67bdad219a1ac766a546fa25df898f3))

# [4.14.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.13.0...v4.14.0) (2022-12-22)

### Features

- add type for CMA client ([#1430](https://github.com/contentful/ui-extensions-sdk/issues/1430)) ([8eb1847](https://github.com/contentful/ui-extensions-sdk/commit/8eb1847b7d779393d0a11c1fe4567c6879dc705f))

# [4.13.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.12.1...v4.13.0) (2022-10-24)

### Features

- add home location [EXT-3684] ([#1388](https://github.com/contentful/ui-extensions-sdk/issues/1388)) ([9193e43](https://github.com/contentful/ui-extensions-sdk/commit/9193e433e3265a5a4bdc2e23d0a8dcad74b15771))

## [4.12.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.12.0...v4.12.1) (2022-09-12)

### Bug Fixes

- make ContentEntityType more specific ([#1328](https://github.com/contentful/ui-extensions-sdk/issues/1328)) ([99bda6e](https://github.com/contentful/ui-extensions-sdk/commit/99bda6ef13c91bc3f4bb06ae486f1875b7045895))

# [4.12.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.11.1...v4.12.0) (2022-08-15)

### Features

- ui-config updates [EXT-3738] ([#1344](https://github.com/contentful/ui-extensions-sdk/issues/1344)) ([524a701](https://github.com/contentful/ui-extensions-sdk/commit/524a701c43597a874218cdc458924b82087aa8c8))

## [4.11.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.11.0...v4.11.1) (2022-08-02)

### Bug Fixes

- add missing properties to new `init` method ([#1338](https://github.com/contentful/ui-extensions-sdk/issues/1338)) ([4370508](https://github.com/contentful/ui-extensions-sdk/commit/4370508149337e6b7355f700b7d24f67f80434c7))

# [4.11.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.10.0...v4.11.0) (2022-08-01)

### Features

- `init` can be called at any time ([#1319](https://github.com/contentful/ui-extensions-sdk/issues/1319)) ([d95d441](https://github.com/contentful/ui-extensions-sdk/commit/d95d44131de72f9ecbb4cac4f2439bd6dd05a912))

# [4.10.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.9.0...v4.10.0) (2022-07-26)

### Features

- add query param to getTasks ([#1335](https://github.com/contentful/ui-extensions-sdk/issues/1335)) ([8e79721](https://github.com/contentful/ui-extensions-sdk/commit/8e79721b9a60adb181e67c87831674dd78145588))

# [4.9.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.8.1...v4.9.0) (2022-07-12)

### Features

- [] add option to entry publish method ([#1306](https://github.com/contentful/ui-extensions-sdk/issues/1306)) ([e6aaab1](https://github.com/contentful/ui-extensions-sdk/commit/e6aaab1f414e535a66b7d1679be82ef210d750b9))

## [4.8.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.8.0...v4.8.1) (2022-06-28)

### Bug Fixes

- make init a noop for non-browser environments ([#1308](https://github.com/contentful/ui-extensions-sdk/issues/1308)) ([253c5c8](https://github.com/contentful/ui-extensions-sdk/commit/253c5c8e3e5c3e7f7047f8826e436923f778eb93))
- use App SDK instead of UI Extensions in error message ([#1307](https://github.com/contentful/ui-extensions-sdk/issues/1307)) ([06ec441](https://github.com/contentful/ui-extensions-sdk/commit/06ec44182a4439776aaf83669d9db5497a6c93c6))

# [4.8.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.7.0...v4.8.0) (2022-06-15)

### Features

- exported workflow definition type ([#1295](https://github.com/contentful/ui-extensions-sdk/issues/1295)) ([490e5db](https://github.com/contentful/ui-extensions-sdk/commit/490e5dba4e899134155cf21c3fff2ef772692c0b))

# [4.7.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.6.0...v4.7.0) (2022-06-15)

### Features

- added worflowdefinition type to exported entities and to api.types ([#1294](https://github.com/contentful/ui-extensions-sdk/issues/1294)) ([b2d917f](https://github.com/contentful/ui-extensions-sdk/commit/b2d917fb7f261a27a00661486594d8d0e2f5ac25))

# [4.6.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.5.0...v4.6.0) (2022-06-01)

### Features

- add option to include absolute elements in auto resizer ([#901](https://github.com/contentful/ui-extensions-sdk/issues/901)) ([0269b00](https://github.com/contentful/ui-extensions-sdk/commit/0269b008cce52af63adef26cb68e163c56c3f2e0))

# [4.5.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.4.1...v4.5.0) (2022-05-18)

### Features

- add organization to sdk.ids ([#1271](https://github.com/contentful/ui-extensions-sdk/issues/1271)) ([b3eca1c](https://github.com/contentful/ui-extensions-sdk/commit/b3eca1c9eee3511564270b710d48ba532aaa5dba))

## [4.4.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.4.0...v4.4.1) (2022-05-16)

### Bug Fixes

- Use ResizeObserver to track iframe body size changes [EXT-3733] ([#1263](https://github.com/contentful/ui-extensions-sdk/issues/1263)) ([391b282](https://github.com/contentful/ui-extensions-sdk/commit/391b282842c7c92e98f1c645d0f9189a6d96cb36))

# [4.4.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.7...v4.4.0) (2022-05-09)

### Features

- add warning notification support [SHE-785] ([#1232](https://github.com/contentful/ui-extensions-sdk/issues/1232)) ([be30251](https://github.com/contentful/ui-extensions-sdk/commit/be3025109432ff24b56155d9f9177ba89107d850))

## [4.3.7](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.6...v4.3.7) (2022-04-13)

### Bug Fixes

- make openNewAsset options param optional ([#1239](https://github.com/contentful/ui-extensions-sdk/issues/1239)) ([bdf3336](https://github.com/contentful/ui-extensions-sdk/commit/bdf333645d1522f8458ceb55bc0d9226cfffb26a))

## [4.3.6](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.5...v4.3.6) (2022-04-12)

### Bug Fixes

- [] improved types for ParametersAPI ([#1236](https://github.com/contentful/ui-extensions-sdk/issues/1236)) ([abf53c0](https://github.com/contentful/ui-extensions-sdk/commit/abf53c0f4fcc73ffd43e37e4960a277a1d259e98))

## [4.3.5](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.4...v4.3.5) (2022-02-23)

### Bug Fixes

- explicitly state 5.0.0 deprecation plan ([#1194](https://github.com/contentful/ui-extensions-sdk/issues/1194)) ([6a73271](https://github.com/contentful/ui-extensions-sdk/commit/6a7327116f99f7ee3791e111ea37e6670d600127))

## [4.3.4](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.3...v4.3.4) (2022-02-21)

### Bug Fixes

- support contentful-management v8 and later ([#1190](https://github.com/contentful/ui-extensions-sdk/issues/1190)) ([45fdefe](https://github.com/contentful/ui-extensions-sdk/commit/45fdefe10abda5ae69703a5e1dd981152966fddc))

## [4.3.3](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.2...v4.3.3) (2022-02-14)

### Bug Fixes

- [EXT-3363] use correct IDS api for fields ([#1184](https://github.com/contentful/ui-extensions-sdk/issues/1184)) ([84daaa2](https://github.com/contentful/ui-extensions-sdk/commit/84daaa21fd371cbfef8bd9ec0ba6b606ba689869))

## [4.3.2](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.1...v4.3.2) (2022-02-09)

### Bug Fixes

- return same SDK instance when calling `init` multiple times ([#1173](https://github.com/contentful/ui-extensions-sdk/issues/1173)) ([8acc077](https://github.com/contentful/ui-extensions-sdk/commit/8acc077ca5f168ed22a292f624f98384e775ab62))

## [4.3.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.0...v4.3.1) (2021-11-10)

### Bug Fixes

- export team type ([#1072](https://github.com/contentful/ui-extensions-sdk/issues/1072)) ([2845c96](https://github.com/contentful/ui-extensions-sdk/commit/2845c966f663df42a0fd47aaf4b34acee18565d6))

# [4.3.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.2.1...v4.3.0) (2021-10-26)

### Features

- [EXT-2755] add save and (un)publish command ([#1040](https://github.com/contentful/ui-extensions-sdk/issues/1040)) ([f1a4de4](https://github.com/contentful/ui-extensions-sdk/commit/f1a4de47dfc73ad1624cf0292745ce594b6250eb))

## [4.2.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.2.0...v4.2.1) (2021-10-07)

### Bug Fixes

- LinkContentTypeValidationError contains a list of content types ([#1021](https://github.com/contentful/ui-extensions-sdk/issues/1021)) ([64a8c05](https://github.com/contentful/ui-extensions-sdk/commit/64a8c05a022275f85a5138d9186de98e9079aadb))

# [4.2.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.1.1...v4.2.0) (2021-10-06)

### Features

- export Action and ValidationError types ([#1018](https://github.com/contentful/ui-extensions-sdk/issues/1018)) ([dcff361](https://github.com/contentful/ui-extensions-sdk/commit/dcff361863c5ed1d6448d834277db26385cd6f8a))

## [4.1.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.1.0...v4.1.1) (2021-10-06)

### Bug Fixes

- [3161] use correct type for conflicting errors ([#1017](https://github.com/contentful/ui-extensions-sdk/issues/1017)) ([621a1d0](https://github.com/contentful/ui-extensions-sdk/commit/621a1d0d8f4e7b1ab45278377ba58fff76e09a4f))

# [4.1.0](https://github.com/contentful/ui-extensions-sdk/compare/v4.0.1...v4.1.0) (2021-10-05)

### Features

- [] export validation error type ([#1011](https://github.com/contentful/ui-extensions-sdk/issues/1011)) ([983407e](https://github.com/contentful/ui-extensions-sdk/commit/983407ebffe0b818c01a80bf4fa6f2a6c301aa5d))

## [4.0.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.0.0...v4.0.1) (2021-10-05)

### Bug Fixes

- measure old css file usage ([#1010](https://github.com/contentful/ui-extensions-sdk/issues/1010)) ([7dcd079](https://github.com/contentful/ui-extensions-sdk/commit/7dcd079c5f17f0a4e01e48e8184f0285dd0e9e1b))

# [4.0.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.42.0...v4.0.0) (2021-10-05)

This major release of the Contentful App SDK provides two great features to make app development for Contentful even easier.

## Contentful Management API Adapter

You can now use the [`contentful-management` library](https://github.com/contentful/contentful-management.js) within apps. This gives you access to a huge load of APIs that were previously not available. Also, you can reuse existing code utilising the `contentful-management` library which makes it easier to convert your custom Contentful scripts to convenient apps.

After installing the library, a new client can be created using the `cmaAdapter` which is exposed by the App SDK. There is no need to deal with authentication and tokens.

```javascript
import { createClient } from 'contentful-management'

const nestedClient = createClient({ apiAdapter: sdk.cmaAdapter })

const cma = createClient(
  { apiAdapter: sdk.cmaAdapter },
  {
    type: 'plain',
    defaults: {
      environmentId: sdk.ids.environment,
      spaceId: sdk.ids.space,
    },
  },
)
```

Please note that not all methods are available. You can only use methods that access entities within the app’s space environment.

## Deprecation of Space API

The Space API (`sdk.space`) is deprecated and will be removed in a future major update of the App SDK. We recommend using the new CMA Adapters to replace existing Space API functionality.

## Typings revamp

In the previous version of the App SDK app developers sometimes struggled with our provided types. For version 4 we took the opportunity to revamp and significantly improve the types of the whole library. These changes are likely to break existing TypeScript apps as we are more specific about each property and also changed the usage of generics on API methods.
The new types of the App SDK now align with the types of the `contentful-management` library.
To get the best development experience, you need to install `contentful-management` as a separate dependency.

```bash
npm install contentful-management
```

We do not include this dependency by default to keep your dependency tree clean and ensure small bundle sizes and short build times.

# [3.42.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.41.0...v3.42.0) (2021-10-01)

### Features

- show better warning for DATA_CLONE_ERR [EXT-2761] ([#989](https://github.com/contentful/ui-extensions-sdk/issues/989)) ([fb82d86](https://github.com/contentful/ui-extensions-sdk/commit/fb82d866c4ffc97554673ea8e32bc8b81fa5f33c))

# [3.41.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.40.1...v3.41.0) (2021-09-29)

### Features

- Include patch in message ([#997](https://github.com/contentful/ui-extensions-sdk/issues/997)) ([0a97537](https://github.com/contentful/ui-extensions-sdk/commit/0a97537e3426dfb9a2c95365ae4c96eeb848d8b4))

## [3.40.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.40.0...v3.40.1) (2021-09-23)

### Bug Fixes

- **AccessSDK:** patch action isn't supported ([#987](https://github.com/contentful/ui-extensions-sdk/issues/987)) ([7aff0ae](https://github.com/contentful/ui-extensions-sdk/commit/7aff0aeb4d3680e33a2ab7173a78982c55fa3677))

# [3.40.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.39.2...v3.40.0) (2021-09-17)

### Features

- **AccessAPI:** add support for JSON patches in access sdk [EXT-3041] ([#974](https://github.com/contentful/ui-extensions-sdk/issues/974)) ([a720fc2](https://github.com/contentful/ui-extensions-sdk/commit/a720fc223b19419f61fb5df917540834966dbd83))

## [3.39.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.39.0...v3.39.1) (2021-09-10)

### Bug Fixes

- create upload types ([#961](https://github.com/contentful/ui-extensions-sdk/issues/961)) ([a65b320](https://github.com/contentful/ui-extensions-sdk/commit/a65b32046087763708f521b5b2dbb92ac22c6579))

# [3.39.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.38.0...v3.39.0) (2021-07-20)

### Features

- Add typings and expose metadata methods ([#865](https://github.com/contentful/ui-extensions-sdk/issues/865)) ([b0bbaad](https://github.com/contentful/ui-extensions-sdk/commit/b0bbaad477114f7929d974b8bce8c3c03f05f4bf))

# [3.38.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.37.0...v3.38.0) (2021-06-30)

### Features

- add resolved info to tasks sys ([#822](https://github.com/contentful/ui-extensions-sdk/issues/822)) ([e0be824](https://github.com/contentful/ui-extensions-sdk/commit/e0be824956082aaa8fe00bd073f7354fb7dea51b))

# [3.37.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.36.0...v3.37.0) (2021-06-23)

### Features

- add type parameter to create task input data ([#809](https://github.com/contentful/ui-extensions-sdk/issues/809)) ([e0fe688](https://github.com/contentful/ui-extensions-sdk/commit/e0fe688b3e07cf58abd20a0b1f9d82c7ea1e48e7))

# [3.36.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.35.0...v3.36.0) (2021-06-17)

### Features

- add interface for space.getTeams [HOMER-75] ([#789](https://github.com/contentful/ui-extensions-sdk/issues/789)) ([a5b8dac](https://github.com/contentful/ui-extensions-sdk/commit/a5b8dac92293d2e58ba7625ca4a310d182f3cabf))

# [3.35.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.34.3...v3.35.0) (2021-06-11)

### Features

- add due date as a task field type ([#776](https://github.com/contentful/ui-extensions-sdk/issues/776)) ([ed0bf60](https://github.com/contentful/ui-extensions-sdk/commit/ed0bf60ce877665a3558555346c6bf0c9274bb49))

## [3.34.3](https://github.com/contentful/ui-extensions-sdk/compare/v3.34.2...v3.34.3) (2021-05-18)

### Reverts

- "chore: test that SDK respects alias ([#710](https://github.com/contentful/ui-extensions-sdk/issues/710))" ([#717](https://github.com/contentful/ui-extensions-sdk/issues/717)) ([4ab6e48](https://github.com/contentful/ui-extensions-sdk/commit/4ab6e48237ef6d4cdd75c7721cd994539ced0ce2))

## [3.34.2](https://github.com/contentful/ui-extensions-sdk/compare/v3.34.1...v3.34.2) (2021-05-11)

### Reverts

- bump cypress from 7.2.0 to 7.3.0 ([#706](https://github.com/contentful/ui-extensions-sdk/issues/706)) ([ebcdf01](https://github.com/contentful/ui-extensions-sdk/commit/ebcdf01c26c59707e5733f34d8897a9de9bfa462))

## [3.34.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.34.0...v3.34.1) (2021-05-06)

### Bug Fixes

- make options of dialogs.openExtension optional ([#681](https://github.com/contentful/ui-extensions-sdk/issues/681)) ([ca6d15b](https://github.com/contentful/ui-extensions-sdk/commit/ca6d15bf6c9979410296dfaa3f2ad3bd71ba33c4))

# [3.34.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.33.0...v3.34.0) (2021-04-30)

### Features

- add navigate to lists methods ([ef5ee41](https://github.com/contentful/ui-extensions-sdk/commit/ef5ee4148911f51b333dbd0967d5fba2748de317))

# [3.33.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.32.2...v3.33.0) (2021-04-06)

### Features

- expose tags api ([3ae6b4b](https://github.com/contentful/ui-extensions-sdk/commit/3ae6b4b45a16f04cb931218b6df654e9bf97cc1b))

## [3.32.2](https://github.com/contentful/ui-extensions-sdk/compare/v3.32.1...v3.32.2) (2021-03-23)

### Bug Fixes

- [EXT-2508] use husky v4 ([#611](https://github.com/contentful/ui-extensions-sdk/issues/611)) ([85e1d4f](https://github.com/contentful/ui-extensions-sdk/commit/85e1d4f43e710b747f0ecba9d35396d8dfaacc10))

## [3.32.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.32.0...v3.32.1) (2021-02-16)

### Bug Fixes

- link to App SDK reference ([#550](https://github.com/contentful/ui-extensions-sdk/issues/550)) ([be47635](https://github.com/contentful/ui-extensions-sdk/commit/be47635c3c5b621e501df3643292c6c2bd2ef417))

# [3.32.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.31.1...v3.32.0) (2021-01-29)

### Features

- add Task API to sdk.entry ([#516](https://github.com/contentful/ui-extensions-sdk/issues/516)) ([334097c](https://github.com/contentful/ui-extensions-sdk/commit/334097cf164b93b745bed53e740444b5db84a066))

# [3.31.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.31.0...v3.31.1) (2021-01-28)

### Documentation

- rename UIE SDK to App SDK in readme ([#508](https://github.com/contentful/ui-extensions-sdk/issues/508)) ([d565d3d](https://github.com/contentful/ui-extensions-sdk/commit/d565d3d144ab6906994996e9221ef9d70ca41f0c))
- add repository and homepage to package.json ([#509](https://github.com/contentful/ui-extensions-sdk/issues/509)) ([d301d46](https://github.com/contentful/ui-extensions-sdk/commit/d301d46509f6165444ad78363ef26a0a3ecf5b30))

# [3.31.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.30.0...v3.31.0) (2021-01-13)

### Features

- export module as contentfulApp ([#490](https://github.com/contentful/ui-extensions-sdk/issues/490)) ([0eb5aaa](https://github.com/contentful/ui-extensions-sdk/commit/0eb5aaa425adda39f5f800e64b906694d636b53d))

# [3.30.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.29.2...v3.30.0) (2021-01-13)

### Features

- generate typings ([#473](https://github.com/contentful/ui-extensions-sdk/issues/473)) ([1c9a69b](https://github.com/contentful/ui-extensions-sdk/commit/1c9a69b33e6833e7e16ae6de1e93de89409b73fd))

## [3.29.2](https://github.com/contentful/ui-extensions-sdk/compare/v3.29.1...v3.29.2) (2021-01-11)

### Bug Fixes

- emit build errors ([#484](https://github.com/contentful/ui-extensions-sdk/issues/484)) ([5a0f20d](https://github.com/contentful/ui-extensions-sdk/commit/5a0f20d1a126defc091442a336d8551454738051))

## [3.29.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.29.0...v3.29.1) (2021-01-08)

### Bug Fixes

- correct type for canEditAppConfig ([#481](https://github.com/contentful/ui-extensions-sdk/issues/481)) ([808521f](https://github.com/contentful/ui-extensions-sdk/commit/808521f47182775b8a6729fe11c46f8f02ef6729))

# [3.29.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.28.1...v3.29.0) (2021-01-08)

### Features

- add canEditAppConfig method ([#480](https://github.com/contentful/ui-extensions-sdk/issues/480)) ([594d37d](https://github.com/contentful/ui-extensions-sdk/commit/594d37d8183be0a4a0edb06a7193a5236ef22208))

## [3.28.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.28.0...v3.28.1) (2021-01-08)

### Bug Fixes

- make signRequest non optional ([#479](https://github.com/contentful/ui-extensions-sdk/issues/479)) ([0f932f1](https://github.com/contentful/ui-extensions-sdk/commit/0f932f18851ac976e8894553696cda2b374a9d8c))

# [3.28.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.27.0...v3.28.0) (2021-01-07)

### Features

- add openAppConfig method ([#476](https://github.com/contentful/ui-extensions-sdk/issues/476)) ([80a808d](https://github.com/contentful/ui-extensions-sdk/commit/80a808d37ebcbb641a6fe3f472efecacc0a65af3))

# [3.27.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.26.1...v3.27.0) (2021-01-05)

### Features

- [EXT-2360] add test for onvaluechanged ([#431](https://github.com/contentful/ui-extensions-sdk/issues/431)) ([229d930](https://github.com/contentful/ui-extensions-sdk/commit/229d93072242deab7c38db5c675ccdd1c058e1f7))

# [3.26.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.26.0...v3.26.1) (2021-11-24)

### Features

- Add env alias to IdsApi type

# [3.25.1](https://github.com/contentful/ui-extensions-sdk/compare/v3.25.0...v3.26.0) (2021-11-24)

### Features

- Bump dependencies

# [3.25.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.24.0...v3.25.0) (2020-11-09)

### Bug Fixes

- only expose signRequest in apps ([169ff70](https://github.com/contentful/ui-extensions-sdk/commit/169ff70a2d74498406560f51a6eec00af88f41a9))
- request signing endpoint can be undefined ([2eb0d76](https://github.com/contentful/ui-extensions-sdk/commit/2eb0d76ee7fd79bf906069e7ecf842b16f1cd300))

### Features

- [EXT-2360] add test for onvaluechanged ([#431](https://github.com/contentful/ui-extensions-sdk/issues/431)) ([229d930](https://github.com/contentful/ui-extensions-sdk/commit/229d93072242deab7c38db5c675ccdd1c058e1f7))

# [3.24.0](https://github.com/contentful/ui-extensions-sdk/compare/v3.23.4...v3.24.0) (2020-11-02)

### Features

- log error if it appears app is running outside of iframe ([#390](https://github.com/contentful/ui-extensions-sdk/issues/390)) ([c46be9d](https://github.com/contentful/ui-extensions-sdk/commit/c46be9db35f0a6b72cb50851009b836146235b31))
