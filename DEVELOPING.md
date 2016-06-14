## Developing the Widget SDK

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
