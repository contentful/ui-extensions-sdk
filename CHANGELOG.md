## [4.3.7](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.6...v4.3.7) (2022-04-13)

### Bug Fixes

- make openNewAsset options param optional ([#1239](https://github.com/contentful/ui-extensions-sdk/issues/1239)) ([bdf3336](https://github.com/contentful/ui-extensions-sdk/commit/bdf333645d1522f8458ceb55bc0d9226cfffb26a))

## [4.3.6](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.5...v4.3.6) (2022-04-12)

### Bug Fixes

- [] improved types for ParametersAPI ([#1236](https://github.com/contentful/ui-extensions-sdk/issues/1236)) ([abf53c0](https://github.com/contentful/ui-extensions-sdk/commit/abf53c0f4fcc73ffd43e37e4960a277a1d259e98))

# [4.4.0-alpha.1](https://github.com/contentful/ui-extensions-sdk/compare/v4.3.5...v4.4.0-alpha.1) (2022-04-01)

### Features

- add entry list location ([bf72726](https://github.com/contentful/ui-extensions-sdk/commit/bf727265e3872b75c1f02eb940b5879fe31c7781))

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
  }
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
