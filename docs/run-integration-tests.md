# Run integration tests

## Writing tests and running them locally

1. Create `.env` file at the root of the repository with the following variables:

```bash
# Generate PAT token here: https://www.contentful.com/r/knowledgebase/personal-access-tokens/
CONTENTFUL_CMA_TOKEN=<personal-cma-token>
# ID of the space
CONTENTFUL_SPACE_ID=<testing-space-id>
# Url of the web app we test against
CYPRESS_BASE_URL=https://app.contentful.com
# If true, then local version of ui-extension-sdk will be used in all testing extension
# Otherwise, it's latest version of ui-extension-sdk from NPM
TEST_LOCAL_SDK=true
# Target environment for local testing.
# When running tests locally we won't create a new environment dynamically
CONTENTFUL_LOCAL_TESTING_ENV=<envinonment-name-that-you-will-use-for-testing>
```

2. Run the following commands

```bash
# install all build dependencies
npm install
# build local version of ui-extensions-sdk
npm run build
# build all testing extensions and install them in testing environment of your space
npm run integration:local
```

3. Open Cypress in development mode

```bash
npm run cypress:open
```

4. Edit cypress tests

Edit exising tests or create a new one in `test/cypress/integration` folder.
