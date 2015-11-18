'use strict';

var url = require('url');
var Contentful = require('contentful-management');
var http = require('../http');
var flags = require('./flags');

module.exports = function (name) {
  var command = require(`../command/${name}`);

  let token = ensureCMAtoken();
  let options = flags.for(name);
  let context = setupCommandContext({token: token, host: options.host});

  command(options, context);
};

function ensureCMAtoken () {
  let token = process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN;

  if (!token) {
    console.error('CONTENTFUL_MANAGEMENT_ACCESS_TOKEN is undefined or empty');
    process.exit(1);
  }

  return token;
}
function setupCommandContext (options) {
  let urlInfo = url.parse(options.host || 'https://api.contentful.com');
  let host = urlInfo.host;
  let isSecure = urlInfo.protocol === 'https:';

  let client = Contentful.createClient({
    accessToken: options.token,
    host: host,
    secure: isSecure
  });

  return {
    client: client,
    http: http
  };
}
