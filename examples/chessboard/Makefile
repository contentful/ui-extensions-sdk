TOKEN=0aa7f136416f88c78ad84edf2f82a0e8a294d9cc9f6c9c809689cf525a647957
SPACE=c2qz3rkoqmmx

export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN := $(TOKEN)

# Move all assets to the 'dist/' directory
build:
	rm -r dist
	mkdir -p dist
	cp -L -t dist -r index.html cf-widget-api.js app.js vendor/chessboard/*

update: widget.json
	contentful-widget update --space-id ${SPACE} --force

create: widget.json
	contentful-widget create --space-id ${SPACE}
