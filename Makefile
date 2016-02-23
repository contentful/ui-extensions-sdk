export PATH := ./node_modules/.bin:${PATH}

.PHONY: build build-pages lint clean test

# Compile the API from the lib directory into dist/cf-widget-api.js and dist/cf-widget-api.css
build:
	webpack
	@echo "Created 'dist/cf-widget-api-js'"
	@mkdir -p dist
	./node_modules/stylus/bin/stylus -u nib lib/style/index.styl -o dist/cf-widget-api.css --sourcemap

# Build API and Styleguide
build-with-docs: build
	@mkdir -p dist/styleguide
	cp ./lib/style/styleguide.css ./dist/styleguide/styleguide.css
	./node_modules/kss/bin/kss-node --config kss-config.json

build-examples:
	$(MAKE) -C examples/chessboard build
	cp -r examples/chessboard/dist/* dist/examples/chessboard

watch:
	webpack --watch

lint:
	eslint lib/ bin/ test/

test:
	xvfb-run karma start --single-run --browsers SlimerJS --reporters dots

ci: test lint

clean:
	rm -rf dist/*

build-pages: gh-pages build-with-docs
	$(MAKE) -C gh-pages

gh-pages:
	git clone git@github.com:contentful/widget-sdk --branch $@ $@
