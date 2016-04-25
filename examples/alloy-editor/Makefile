# Uncomment the lines below after adding your data
# export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your token>
# export SPACE=<id of space you want to install the widget for>

serve:
	node serve.js

update: widget.json
	contentful-widget update --space-id $(SPACE)

update-force: widget.json
	contentful-widget update --space-id $(SPACE) --force

create: widget.json
	contentful-widget create --space-id $(SPACE)

delete:
	contentful-widget delete --space-id $(SPACE) --id alloy
