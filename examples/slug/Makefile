# Put your token and space id here.
TOKEN=f00b4r
SPACE=my5p4c3

export PATH := ../../bin:${PATH}
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN := $(TOKEN)

build: index.built.html

# Inject all javascript files into 'index.html' to produce 'index.built.html'
index.built.html: index.html app.js
	cp index.html $@
	echo "<script>" >> $@
	uglifyjs cf-widget-api.js>> $@
	echo "</script>" >> $@
	echo "<script>" >> $@
	uglifyjs app.js>> $@
	echo "</script>" >> $@

create: widget.json index.built.html
	contentful-widget create --space-id ${SPACE}

update: widget.json index.built.html
	contentful-widget update --space-id ${SPACE} --force

update-dev: widget.json index.built.html
	contentful-widget update --space-id ${SPACE} --force --src 'http://localhost:8000/index.built.html'

# Or choose any of the server one-liners from
# https://gist.github.com/willurd/5720255
serve:
	python3 -m http.server 8000
