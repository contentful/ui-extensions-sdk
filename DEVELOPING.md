## Developing the UI Extensions SDK

### API documentation and changelog

A commit that changes the public API of the SDK must come with a changelog entry
and an updated to the API documentation.

The entry in the changelog should follow the
[“Keep a Changelog” format](http://keepachangelog.com/). The API documentation
must end with _“In upcoming release”_. If a new version, say v1.2.3, is released
this must be changed to _“Since v1.2.3”_ in the release commit.

### Styles and Styleguide

We use [Stylus][] to build the stylessheets from `lib/styles`. The task `make
styles` will create `dist/cf-widget-api.css`.
We also use [KSS][] to turn comments in the style files into a styleguide. You
can build the styleguide with `make styleguide` which will create HTML files in
`dist/styleguide`.

[Stylus]: http://stylus-lang.com/
[KSS]: http://kss-node.github.io/kss-node/

### Updating GH Pages distribution

We use [Github Pages][] to distribute the compiled Javascript code, stylesheets, and
the styleguide from the `./docs` folder.

If you make any changes to the code or stylesheets run `make build-pages` to
update the `./docs` directory.

[Github Pages]: https://help.github.com/categories/github-pages-basics/

### Releasing a new version of the SDK

1. Add new release to changelog by renaming “Upcoming” to “v1.2.3”.
2. Update API documentation for added methods to include the version they were
   added in (e.g. _“Since 1.2.3”_)
3. Update the version in `package.json`.
4. [Update GH Pages distribution](#updating-gh-pages-distribution)
5. Commit to master.
6. Tag commit as `vX.Y.Z` and push tag to GitHub
7. Publish new version of package on `npm`
