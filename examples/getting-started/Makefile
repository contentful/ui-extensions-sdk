# Customize these values
#
# You can get a token from:
# https://www.contentful.com/developers/docs/references/authentication/#getting-an-oauth-token
TOKEN=0aa7f136416f88c78ad84edf2f82a0e8a294d9cc9f6c9c809689cf525a647957
SPACE=c2qz3rkoqmmx

# Use the `contentful-widget` command from this repo
CF_WIDGET=../../bin/contentful-widget --space-id $(SPACE) --host $(HOST)

# Make the token available to the 'contentful-widget' command
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN := $(TOKEN)

create: widget.json
	$(CF_WIDGET) create

update: widget.json
	$(CF_WIDGET) update --force

update-dev: widget.json
	$(CF_WIDGET) update --force --src "http://localhost:3000"
