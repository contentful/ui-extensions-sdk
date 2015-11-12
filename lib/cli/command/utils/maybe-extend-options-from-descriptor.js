'use strict';

var Bluebird = require('bluebird');
var fs = require('fs');

var readFile = Bluebird.promisify(fs.readFile);

module.exports = function (options) {
  return readFile(options.descriptor)
  .then(function (contents) {
    try {
      return JSON.parse(contents.toString());
    } catch (e) {
      // include path to the offending file
      throw new Error(`${options.descriptor} ${e.message}`);
    }
  })
  .then(function (descriptor) {
    if (!descriptor.id) {
      throw new Error('missing id in descriptor file');
    }

    if (!descriptor.src && !descriptor.srcdoc) {
      throw new Error('missing src and srcdoc in descriptor file');
    }

    if (!options.url) {
      options.url = descriptor.src;
    }

    if (!options.id) {
      options.id = descriptor.id;
    }

    if (!options.file) {
      options.file = descriptor.srcdoc;
    }
  })
  .catch(function (e) {
    if (e.code === 'ENOENT') {
      if (!options.file && !options.url) {
        throw new Error('no widget descriptor or -f or -u options present');
      }

      return;
    }

    throw e;
  });
};
