'use strict';

var Widget = require('../widget');
var maybeExtendOptionsFromDescriptor = require('./utils/maybe-extend-options-from-descriptor');
var maybeReadSrcdocFile = require('./utils/maybe-read-srcdoc-file');

module.exports = function (options, context) {
  return maybeExtendOptionsFromDescriptor(options)
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
