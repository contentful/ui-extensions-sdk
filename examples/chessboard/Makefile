# Uncomment and add your authentication info and space id below
# export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your token here>
# export SPACE=<id of space where you want to install this widget>

GH_PAGES_URL=https://contentful.github.io/widget-sdk/examples/chessboard/

# Run a static webserver inside 'dist'
serve: build
	cd dist && python -m SimpleHTTPServer 3000

# Move all assets to the 'dist/' directory
build:
	mkdir -p dist
	cp -fr index.html app.js vendor/chessboard/* dist/

update: widget.json
	contentful-widget update --space-id $(SPACE) --force

update-gh: widget.json
	contentful-widget update --space-id $(SPACE) --force --src "$(GH_PAGES_URL)"

create: widget.json
	contentful-widget create --space-id $(SPACE)

.PHONY: build
