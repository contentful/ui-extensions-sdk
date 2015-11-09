export PATH := ./node_modules/.bin:${PATH}

.PHONY: build build-pages

# Compile the API from the lib directory into dist/cf-widget-api.js
build:
	webpack

.PHONY: lint
lint:
	eslint lib

.PHONY: clean
clean:
	rm -rf dist/*


build-pages: gh-pages build
	$(MAKE) -C gh-pages

gh-pages:
	git clone git@github.com:contentful/widget-sdk $@
	cd $@
	git checkout $@
