'use strict';

var Widget = require('../widget');
var error = require('./utils/error');
var maybeReadDescriptor = require('./utils/maybe-read-descriptor-file');
var maybeExtendOptions = require('./utils/maybe-extend-options');
var maybeReadSrcdocFile = require('./utils/maybe-read-srcdoc-file');

var formatError = error.format('create');

module.exports = function (options, context) {
  return maybeReadDescriptor(options)
    .then(function (descriptor) {
      let required = ['name', 'fieldTypes', {or: ['src', 'srcdoc']}];

      return maybeExtendOptions(options, descriptor, required);
    })
    .then(function () {
      return maybeReadSrcdocFile(options);
    })
    .then(function () {
      return new Widget(options, context).save();
    })
    .then(function (widget) {
      console.log(JSON.stringify(widget));
    })
    .catch(function (e) {
      console.error(formatError(e.message));
      process.exit(1);
    });
};
