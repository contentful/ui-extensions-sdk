# Getting Started with Contentful Widgets

This guide will walk you through uploading, using, and making changes to
your first widget.

1. [Uploading the widget to a space](#uploading-the-widget-to-a-space)
2. [Using the widget in the Contentful App](#using-the-widget-in-the-contentful-app)
3. [Making changes to the code](#making-changes-to-the-code)

This example widget presents the user with a simple dropdown and writes
number values to the API depending on the selection. It also allows the
user to request a list of entries with the same value at the field the
widget is attached to.

Before you get started, please make sure you have the
`contenful-widget` command available in your path. The
[Widget SDK Readme][readme-getting-started] explains how to install it.

[readme-getting-started]: ../../README.md#getting-started

## Uploading the widget to a space

The first step is to register the widget with the Contentful API to
make the Contentful App aware of its existence.

~~~bash
export CONTENTFUL_MANAGEMENT_ACCESS_TOKEN=abcdefg
contentful-widget create --space-id MY_SPACE_ID
~~~

The command requires an access token to talk to the Contenful API. Our
documentation explains [how to obtain a token][getting-token].

The `contenful-widget` command will upload the data defined in
[`widget.json`](./widget.json) and register it with our app.
The `widget.json` file look like this.

~~~json
{
  "id": "number-dropdown",
  "name": "Rating Dropdown",
  "srcdoc": "./app.html",
  "fieldTypes": ["Integer", "Number"]
}
~~~

The file references `app.html` which contains the code loaded by the
Contentful App.

[getting-token]: https://www.contentful.com/developers/docs/references/authentication/#getting-an-oauth-token


## Using the widget in the Contentful App

Next, we will enable the widget in the Contentful App for a
“Number” field so that you can see it in action.

In your space, choose any Content Type with a “Number” field or create
a new one. Then open the “Settings” dialog for a field and switch to
the appearance tab. A widget with the name “Rating Dropdown” should be
visible at the end of the list. (Note that you need to reload the app
after you uploaded a widget.) Select the widget from the list and save
the Content Type.  Finally you can open an entry for that Content Type
and see the widget rendered.


## Making changes to the code

To simplify development you can host your widget locally.

~~~bash
contentful-widget update --space-id MY_SPACE_ID --force --src "http://localhost:3000/app.html"
python2 -m SimpleHTTPServer 8000
~~~

This will update the widget and tell the Contentful App to load the widget from
`http://localhost:3000/app.html` instead of loading it from the API. It will
also run a static server to serve that file. (If you don’t have Python installed
there are [various ways to serve static files][static-one-liners].)


If you now open an entry that uses the widget in your browser it will use the
code from your local machine. You need to enable insecure content since the
Contentful App is served through HTTPS but your widget is not. See here how to
do it in [Firefox][ff-mixed] and [Chrome][chrome-mixed].

All the code needed to run the widget is contained in `app.html` and
documented there. If you make any changes to that file and reload the
browser page, your changes will be reflected in the widget.

If you want to deploy the code from `app.html` directly again, without
having to serve it locally, you can run
~~~bash
contentful-widget update --space-id MY_SPACE_ID --force
~~~

You can go on from here by having a look at the
[Widget API](../../doc/widget-api-frontend.md) documentation.


[static-one-liners]: https://gist.github.com/willurd/5720255
[ff-mixed]: https://support.mozilla.org/en-US/kb/mixed-content-blocking-firefox
[chrome-mixed]: https://support.google.com/chrome/answer/1342714

