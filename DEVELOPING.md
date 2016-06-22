## Developing the Widget SDK

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
the styleguide. The pages branch contains everything from the `./dist` folder
and should reflect the state of master.

If you make any changes to the code or stylesheets run `make build-pages` to
update the `gh-pages` branch. Then go to the pages directory and commit your
changes

~~~bash
make build-pages
cd gh-pages
git commit -am 'My changes'
git push
~~~

[Github Pages]: https://help.github.com/categories/github-pages-basics/

### Releasing a new version of the sdk

1. Commit with version bump (follow semver) and changelog updates
2. Tag commit as `vX.Y.Z` and push tag to GitHub
3. Publish new version of package on `npm`
4. [Update GH Pages distribution](#updating-gh-pages-distribution)
