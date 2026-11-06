# Support and Maintenance Policy

## Active Support

The latest major version of the App SDK (`@contentful/app-sdk` and `contentful-ui-extensions-sdk`) receives **active support**, which includes:

- New features and enhancements
- Bug fixes
- Security patches
- Performance improvements

We recommend always using the latest major version in production.

## Previous Version Support

When a new major version is released, the previous major version enters a **maintenance period of 6 months**. During this period, the previous version will only receive:

- **Critical bug fixes** — issues that prevent core functionality from working as expected
- **Security vulnerability patches** — fixes for known security issues

No new features, minor bug fixes, or performance improvements will be backported to previous versions during the maintenance period.

To stay on a previous major during its maintenance period, depend on its major range (for example, `npm install @contentful/app-sdk@^4`). If you load the SDK from a CDN, pin the major version in the URL (for example, `@4`) so a new major is never picked up implicitly.

## End of Support

After the 6-month maintenance period, previous major versions are considered **end-of-life** and will no longer receive any updates, including security patches. We strongly encourage upgrading to the latest major version before the maintenance period ends.

Contentful will not deactivate any published packages, so existing installations will continue to function. However, unresolved issues will require upgrading to a supported version.

## Version Support Schedule

| Version          | Status      | Maintenance End |
| ---------------- | ----------- | --------------- |
| v5.x             | Active      | —               |
| v4.x             | Maintenance | 2027-04-28      |
| v3.x and earlier | End of Life | —               |

## Reporting Issues

- **Supported versions**: File an issue on [GitHub](https://github.com/contentful/ui-extensions-sdk/issues/new)
- **Security vulnerabilities**: Please report security issues responsibly via [Contentful's security page](https://www.contentful.com/security/)
