include custom.mk

export PATH := ../../bin:$(PATH)
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN := $(TOKEN)

# Move all assets to the 'dist/' directory
build:
	rm -r dist
	mkdir -p dist
	cp -L -t dist -r index.html cf-widget-api.js app.js vendor/chessboard/*

setup:
	ln -s ../../dist/cf-widget-api.js .
	$(MAKE) create

serve:
	node serve.js

update: widget.json
	contentful-widget update --space-id ${SPACE} --host ${HOST} --force

create: widget.json
	contentful-widget create --space-id ${SPACE} --host ${HOST}
