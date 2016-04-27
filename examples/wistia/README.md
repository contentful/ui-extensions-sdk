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

- Clone the repository or download the repo as a [zip](https://github.com/contentful/widget-sdk/archive/master.zip)
```bash
git clone git@github.com:contentful/widget-sdk.git
```
- Navigate into widget folder
```bash
cd examples/wistia
```
- Install dependencies
```bash
npm install
```
- Create a configuration file with your credentials for Contentful
```bash
touch .env
echo "SPACE_ID={YOUR-SPACE-ID}" >> .env
echo "CONTENTFUL_MANAGEMENT_ACCESS_TOKEN={YOUR-MANAGEMENT-TOKEN}" >> .env

```
and replace space ID, management token and port accordingly.

### Upload the widget to Contentful

- Compile the bundle (index.html) which we are going to upload to our space
```bash
npm run bundle
```
- Create the widget in your space on Contentful
```bash
npm run widget:create
```

### Update the widget

- Make sure to update your bundle with webpack
- Update the widget in your space on Contentful
```bash
npm run bundle
npm run widget:update
```

### Local development

- Start a local server (replace your port if needed)
```bash
python -m SimpleHTTPServer 3030
```
- Tell contentful to render the widget from your local machine
```bash
npm run bundle
npm run widget:dev
```
- Open app.contentful.com, create a ContentType and assign the widget to a supported field.
