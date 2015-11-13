'use strict';

var Widget = require('../widget');
var maybeExtendOptionsFromDescriptor = require('./utils/maybe-extend-options-from-descriptor');
var maybeReadSrcdocFile = require('./utils/maybe-read-srcdoc-file');

module.exports = function (options, context) {
  return maybeExtendOptionsFromDescriptor(options)
    .then(function () {
      if (!options.id) {
        throw new Error('missing id');
      }

      return maybeReadSrcdocFile(options);
    })
    .then(function () {
      if (options.version) {
        return options;
      } else {
        return loadCurrentVersion(options, context);
      }
    }).then(function (options) {
      return new Widget(options, context).save()
      .then(function (widget) {
        console.log(widget);
      });
    })
    .catch(function (e) {
      console.error(`Failed to update the widget: ${e.message}`);
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
      response = JSON.parse(response);
      let version = response.sys.version;
      options.version = version;
      return options;
    });
}
