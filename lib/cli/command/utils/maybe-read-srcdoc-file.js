'use strict';

var Bluebird = require('bluebird');
var fs = require('fs');

var readFile = Bluebird.promisify(fs.readFile);

module.exports = function (options) {
  // TODO handle failures while reading file

  if (!options.srcdoc) {
    return Bluebird.resolve();
  }

  return readFile(options.srcdoc)
    .then(function (contents) {
      options.srcdoc = contents.toString();
    });
};
