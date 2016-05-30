YouTube ID
--------------

![youtube-id](http://contentful.github.io/widget-sdk/assets/youtube-id.png)

This widget extracts the video ID from a YouTube URI.

Compile the widget:

```bash
npm install
make
```

Install widget for space:

```bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=<your Contentful management api token>
export SPACE=<id of space you want to install widget for>

contentful-widget create --space-id $SPACE
```

From this point on, you can use the [other commands](https://github.com/contentful/contentful-widget-cli#available-commands) the contentful-widget-cli provides.
