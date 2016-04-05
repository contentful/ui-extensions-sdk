import Wistia from './components/wistia';

// Require css so we can bundle it with webpack.
require('./css/cf-widget-api.css');
require('./css/styles.css');

// Id of project in Wistia.
const WISTIA_PROJECT_ID = 'on2x2ho05v';
// URL to wistia's api including our read-only API key.
const WISTIA_API_URL = 'https://api.wistia.com/v1/medias.json?api_password=1317a87dbf0a869f2a7e025c3e2c0c984208c0bc6107dd041108fd3ba2ae782d';

let wistia = new Wistia();

let sdk = require('contentful-widget-sdk');
sdk.init(function (widget) {
  wistia.setWidgetAPI(widget);
  wistia.getVideos(WISTIA_PROJECT_ID, WISTIA_API_URL);
})

// Mock widget environment.
//wistia.getVideos(WISTIA_PROJECT_ID, WISTIA_API_URL);

