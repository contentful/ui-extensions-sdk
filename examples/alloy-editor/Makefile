export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN := token
SPACE=spaceid

serve:
	node serve.js

update: widget.json
	contentful-widget update --space-id $(SPACE)

create: widget.json
	contentful-widget create --space-id $(SPACE)

delete:
	contentful-widget delete --space-id $(SPACE) --id alloy
