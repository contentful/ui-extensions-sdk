include custom.mk

export PATH := ../../bin:${PATH}
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN := $(TOKEN)

WIDGET_ID="slug"

.PHONY: upload setup build

build: index.built.html

index.built.html: index.html app.js
	cp index.html $@
	echo "<script>" >> $@
	uglifyjs cf-widget-api.js>> $@
	echo "</script>" >> $@
	echo "<script>" >> $@
	uglifyjs app.js>> $@
	echo "</script>" >> $@

setup:
	ln -sf ../../dist/cf-widget-api.js .
	$(MAKE) create

update: widget.json index.built.html
	cf-widget update --space-id ${SPACE} --host ${HOST} -f index.built.html

create: widget.json index.built.html
	cf-widget create --space-id ${SPACE} --host ${HOST} -f index.built.html

delete:
	cf-widget delete --space-id ${SPACE} --host ${HOST} --id $(WIDGET_ID)
