export PATH := ./node_modules/.bin:${PATH}

.PHONY: build build-pages lint clean test

# Compile the API from the lib directory into dist/cf-widget-api.js and dist/cf-widget-api.css
build: styles
	@mkdir -p dist
	webpack
	@echo "Created 'dist/cf-widget-api-js'"

styles:
	@mkdir -p dist
	stylus \
		--use nib \
		--sourcemap \
		lib/style/index.styl \
		> dist/cf-widget-api.css

# Build API and Styleguide
build-with-docs: build styleguide

styleguide: styles
	@mkdir -p dist/styleguide
	kss-node --config kss-config.json
	cp ./lib/style/styleguide.css ./dist/styleguide/styleguide.css

build-examples:
	$(MAKE) -C examples/chessboard build
	cp -r examples/chessboard/dist/* dist/examples/chessboard

watch:
	webpack --watch

lint:
	eslint lib/ bin/ test/

test:
	karma start --single-run

ci: test lint

clean:
	rm -rf dist/*

build-pages: gh-pages build-with-docs
	$(MAKE) -C gh-pages

gh-pages:
	git clone git@github.com:contentful/widget-sdk --branch $@ $@
