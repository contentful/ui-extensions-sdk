include custom.mk

export PATH := ../../bin:$(PATH)
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN := $(TOKEN)

setup:
	ln -sf ../../dist/cf-widget-api.js .
	$(MAKE) create
	$(MAKE) serve

serve:
	node serve.js

update: widget.json
	cf-widget update --space-id ${SPACE} --host ${HOST}

create: widget.json
	cf-widget create --space-id ${SPACE} --host ${HOST}

delete:
	cf-widget delete --space-id ${SPACE} --host ${HOST} --id alloy
