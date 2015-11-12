'use strict';

var Bluebird = require('bluebird');
var urljoin = require('url-join');

exports.post = function (options, context) {
  let post = Bluebird.promisify(context.request.post);
  let path = `/spaces/${options.spaceId}/widgets`;
  let url = urljoin(context.host, path);
  let requestOpts = {
    url: url,
    body: JSON.stringify(options.payload),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.token}`
    }
  };

  return post(requestOpts)
  .then(function (response) {
    if (response.statusCode !== 201) {
      throw new Error('Request to API failed');
    }

    return response.body;
  });
};

exports.put = function (options, context) {
  let put = Bluebird.promisify(context.request.put);
  let url = urljoin(context.host, 'spaces', options.spaceId, 'widgets', options.id);
  let requestOpts = {
    url: url,
    body: JSON.stringify(options.payload),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.token}`
    }
  };

  if (options.version) {
    requestOpts.headers['X-Contentful-Version'] = options.version;
  }

  return put(requestOpts)
  .then(function (response) {
    if (response.statusCode !== 201 && response.statusCode !== 200) {
      throw new Error('Request to API failed');
    }

    return response.body;
  });
};

exports.get = function (options, context) {
  let get = Bluebird.promisify(context.request.get);
  let path = `/spaces/${options.spaceId}/widgets`;
  let url = urljoin(context.host, path, options.id);
  let requestOpts = {
    url: url,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${context.token}`
    }
  };

  return get(requestOpts)
    .then(function (response) {
      if (response.statusCode !== 200) {
        throw new Error('Request to API failed');
      }

      return response.body;
    });
};

exports.delete = function (options, context) {
  let del = Bluebird.promisify(context.request.del);
  let url = urljoin(context.host, 'spaces', options.spaceId, 'widgets', options.id);
  let requestOpts = {
    url: url,
    headers: {
      'X-Contentful-Version': options.version,
      'Authorization': `Bearer ${context.token}`
    }
  };

  return del(requestOpts)
    .then(function (response) {
      if (response.statusCode !== 204) {
        throw new Error('Request to API failed');
      }
    });
};
