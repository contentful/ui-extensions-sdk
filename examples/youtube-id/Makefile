export PATH := ./node_modules/.bin:${PATH}

.PHONY: build
build: dist/index.html


dist/app.js: app.js
	browserify \
		--entry $< \
		| uglifyjs - \
		--compress \
		--output $@

dist/index.html: index.html dist/app.js
	cp $< $@
	echo "<script>" >> $@
	cat dist/app.js >> $@
	echo "</script>" >> $@


.PHONY: upload
upload: widget.json

widget.json: dist/index.html
	scripts/make-widget.js $< > $@
