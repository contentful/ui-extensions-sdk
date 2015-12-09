export PATH := ./node_modules/.bin:${PATH}

.PHONY: build build-pages lint clean

# Compile the API from the lib directory into dist/cf-widget-api.js
build:
	webpack

docs: build
	@mkdir -p dist
	cp ./lib/style/styleguide.css ./dist/styleguide/styleguide.css
	./node_modules/kss/bin/kss-node --config kss-config.json

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
