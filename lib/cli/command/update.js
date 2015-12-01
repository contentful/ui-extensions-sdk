'use strict';

var Widget = require('../widget');
var error = require('./utils/error');
var maybeReadDescriptor = require('./utils/maybe-read-descriptor-file');
var maybeExtendOptions = require('./utils/maybe-extend-options');
var maybeReadSrcdocFile = require('./utils/maybe-read-srcdoc-file');

var formatError = error.format('update');

module.exports = function (options, context) {
  return maybeReadDescriptor(options)
    .then(function (descriptor) {
      let required = ['id', 'fieldTypes', 'name', { or: ['src', 'srcdoc'] }];

      return maybeExtendOptions(options, descriptor, required);
    })
    .then(function () {
      return maybeReadSrcdocFile(options);
    })
    .then(function () {
      if (options.version) {
        return options;
      } else {
        if (!options.force) {
          throw new Error('to update without version use the --force flag');
        }

        return loadCurrentVersion(options, context);
      }
    }).then(function (options) {
      return new Widget(options, context).save()
      .then(function (widget) {
        console.log(JSON.stringify(widget));
      });
    })
    .catch(function (err) {
      console.error(formatError(err.message));
      process.exit(1);
    });
};

/**
 * GETs the widget from the server and extends `options` with the
 * current version.
 */
function loadCurrentVersion (options, context) {
  return new Widget(options, context).read()
    .then(function (response) {
      let version = response.sys.version;
      options.version = version;
      return options;
    });
}
