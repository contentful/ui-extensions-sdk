## Developing the UI Extensions SDK

### API documentation and changelog

We use semantic versioning.

A commit that changes the public API of the SDK must come with a changelog entry
and an updat to the API documentation. The entry in the changelog should follow the
[“Keep a Changelog” format](http://keepachangelog.com/).

For additions the API documentation must end with _“In upcoming release”_. If a
new version, say v1.2.3, is released this must be changed to _“Since v1.2.3”_ in
the release commit.

For API changes the documentation must end with _“Changed in upcoming release”_.
If a new version, say v1.2.3, is released this must be changed to _“Changed in
v1.2.3”_ in the release commit.

### Styles and Styleguide

We use [Stylus][] to build the stylessheets from `lib/styles`. The task `make
styles` will create `dist/cf-widget-api.css`.
We also use [KSS][] to turn comments in the style files into a styleguide. You
can build the styleguide with `make styleguide` which will create HTML files in
`dist/styleguide`.

[Stylus]: http://stylus-lang.com/
[KSS]: http://kss-node.github.io/kss-node/

### Updating GH Pages distribution

We use [Github Pages][] to distribute the styleguide from the `./docs` folder.

If you make any changes to the stylesheets run `make build-pages` to
update the `./docs` directory and add it to your commit.

For backwards compatibility we also distribute the code and styles for `v2.1.0`
from Github Pages. These are not updated automatically anymore since we use
[`unpkg.com`][unpkg].

[Github Pages]: https://help.github.com/categories/github-pages-basics/
[unpkg]: https://unpkg.com

### Releasing a new version of the SDK

1. Add new release to changelog by renaming “Upcoming” to “v1.2.3”.
1. Update API documentation for added methods to include the version they were
   added in (e.g. _“Since v1.2.3”_, _“Changed in v1.2.3”_)
1. Update the version in `package.json`.
1. Update the [`files`][npm-files] property in `package.json` if necessary.
1. Commit to master.
1. Tag commit as `vX.Y.Z` and push tag to GitHub
1. Publish new version of package on `npm`
