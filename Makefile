export PATH := ./node_modules/.bin:${PATH}

.PHONY: build build-pages lint clean

# Compile the API from the lib directory into dist/cf-widget-api.js
build:
	webpack
	@echo "Created 'dist/cf-widget-api-js'"
	@mkdir -p dist
	./node_modules/stylus/bin/stylus -u nib lib/style/index.styl -o dist/cf-widget-api.css --sourcemap

docs: build
	@mkdir -p dist
	cp ./lib/style/styleguide.css ./dist/styleguide/styleguide.css
	./node_modules/kss/bin/kss-node --config kss-config.json

build-examples:
	$(MAKE) -C examples/chessboard build
	cp -r examples/chessboard/dist/* dist/examples/chessboard

watch:
	webpack --watch

lint:
	eslint lib/ bin/ test/

clean:
	rm -rf dist/*

build-pages: gh-pages build
	$(MAKE) -C gh-pages

gh-pages:
	git clone git@github.com:contentful/widget-sdk $@
	cd $@
	git checkout $@
