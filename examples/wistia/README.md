Wistia Widget 
-------------

The wistia widget loads videos from a [project](http://wistia.com/doc/projects) on [wistia](http://wistia.com/) into the Contentful UI. A video can be easily previewed, selected and then stored as part of your content. In this example widget we store the video embed URL in Contentful so the video can be embedded easily. 

![Screenshot of Wistia widget](http://contentful.github.io/widget-sdk/assets/wistia.gif)

### Requirements

- Contentful
    - a space to use the widget and the space id
    - an api key for Contentful's Mangement API
- Wistia
    - an account with [wistia](http://wistia.com/)
    - an API key from wistia, preferably with read-only permissions only
- Local machine
    - npm installed and configured on your system

### Installation

1. Clone the repository or download the repo as a [zip](https://github.com/contentful/widget-sdk/archive/master.zip)
```bash
git clone git@github.com:contentful/widget-sdk.git
```
2. Navigate into widget folder
```bash
cd examples/wistia
```
3. Install dependencies
```bash
npm install
```
4. Create a configuration file with your credentials for Contentful
```bash
touch .env
echo "$SPACE_ID={YOUR-SPACE-ID}" >> .env
echo "$CONTENTFUL_MANAGEMENT_ACCESS_TOKEN={YOUR-MANAGEMENT-TOKEN}" >> .env
echo "$PORT={YOUR-PORT}" >> .env
```
and replace space ID, management token and port accordingly.

### Upload the widget to Contentful

1. Compile the bundle (index.html) which we are going to upload to our space
```bash
webpack
```
2. Create the widget in your space on Contentful
```bash
npm run widget:create
```

### Update the widget

1. Make sure to update your bundle with webpack
2. Update the widget in your space on Contentful
```bash
npm run widget:update
```

### Local development

1. Start a local server (replace your port if needed)
```bash
python -m SimpleHTTPServer 3030
```
2. Tell contentful to render the widget from your local machine
```bash
npm run widget:dev
```
3. Open app.contentful.com, create a ContentType and assign the widget to a supported field