# Run integration tests

## Writing tests and running them locally

1. Create `.env` file at the root of the repository with the following variables:

```bash
CONTENTFUL_CMA_TOKEN=<personal-cma-token>
CONTENTFUL_SPACE=<testing-space-id>
CYPRESS_BASE_URL=https://app.contentful.com
TEST_LOCAL_SDK=true
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
