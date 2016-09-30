export PATH := ./node_modules/.bin:${PATH}

.PHONY: build build-pages lint clean test

# Compile the API from the lib directory into dist/cf-extension-api.js and dist/cf-extension-api.css
build: styles
	@mkdir -p dist
	webpack
	@echo "Created 'dist/cf-extension-api.*'"

styles:
	@mkdir -p dist
	stylus \
		--use nib \
		--sourcemap \
		lib/style/index.styl \
		--out dist/cf-extension.css

# Build API and Styleguide
build-with-docs: build styleguide

styleguide: styles
	@mkdir -p dist/styleguide
	kss-node --config kss-config.json
	cp ./lib/style/styleguide.css ./dist/styleguide/styleguide.css

watch:
	webpack --watch

lint:
	eslint lib/ bin/ test/

test:
	karma start --single-run

ci: test lint

clean:
	rm -rf dist/*

build-pages: build-with-docs
	cp -r dist/styleguide docs
