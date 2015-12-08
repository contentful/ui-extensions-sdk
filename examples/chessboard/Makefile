-include custom.mk

export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN := $(TOKEN)

# Move all assets to the 'dist/' directory
build:
	mkdir -p dist
	cp -f \
		-t dist \
		-r index.html app.js vendor/chessboard/*

# Run a static webserver inside 'dist'
serve: build
	cd dist && python2 -m SimpleHTTPServer 3000

update: widget.json
	contentful-widget update --space-id $(SPACE) --force

create: widget.json
	contentful-widget create --space-id $(SPACE)
