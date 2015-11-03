export PATH := ./node_modules/.bin:${PATH}

.PHONY: build

# Compile the API from the lib directory into dist/cf-widget-api.js
build:
	webpack

.PHONY: lint
lint:
	eslint lib

.PHONY: clean
clean:
	rm -rf dist/*
