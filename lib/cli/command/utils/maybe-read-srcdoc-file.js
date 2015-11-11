'use strict';

var Bluebird = require('bluebird');
var fs = require('fs');

var readFile = Bluebird.promisify(fs.readFile);

module.exports = function (options) {
  // TODO handle failures while reading file

  if (!options.file) {
    return Bluebird.resolve();
  }

  return readFile(options.file)
    .then(function (contents) {
      options.bundle = contents.toString();
    });
};
