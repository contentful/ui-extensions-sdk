'use strict';

var url = require('url');
var Contentful = require('contentful-management');
var error = require('../command/utils/error');
var http = require('../http');
var flags = require('./flags');

module.exports = function (name) {
  let command = require(`../command/${name}`);
  let env = fetchEnvironmentOptions();
  let defaults = { host: env.host };
  let options = flags.for(name, defaults);

  if (options.help) {
    console.log(flags.helpFor(name));
    process.exit(0);
  }

  let token = ensureCMAtoken(env, name);
  let context = setupCommandContext({token: token, host: options.host});

  command(options, context);
};

function ensureCMAtoken (env, command) {
  let token = env.token;

  if (!token) {
    let msg = error.format(command)(
      'CONTENTFUL_MANAGEMENT_ACCESS_TOKEN is undefined or empty'
    );
    console.error(msg);
    process.exit(1);
  }

  return token;
}

function fetchEnvironmentOptions () {
  return {
    token: process.env.CONTENTFUL_MANAGEMENT_ACCESS_TOKEN,
    host: process.env.CONTENTFUL_MANAGEMENT_HOST
  };
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
