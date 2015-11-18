'use strict';

var Widget = require('../widget');
var maybeReadDescriptor = require('./utils/maybe-read-descriptor-file');
var maybeExtendOptions = require('./utils/maybe-extend-options');
var maybeReadSrcdocFile = require('./utils/maybe-read-srcdoc-file');

module.exports = function (options, context) {
  return maybeReadDescriptor(options)
    .then(function (descriptor) {
      let required = ['name', {or: ['src', 'srcdoc']}];

      return maybeExtendOptions(options, descriptor, required);
    })
    .then(function () {
      return maybeReadSrcdocFile(options);
    })
    .then(function () {
      return new Widget(options, context).save();
    })
    .then(function (widget) {
      console.log(widget);
    })
    .catch(function (e) {
      console.error(`Failed to create the widget: ${e.message}`);
      process.exit(1);
    });
};
