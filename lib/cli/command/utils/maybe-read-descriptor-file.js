'use strict';

var Bluebird = require('bluebird');
var fs = require('fs');
var path = require('path');

var readFileAsync = Bluebird.promisify(fs.readFile);
var statFileAsync = Bluebird.promisify(fs.stat);
var DEFAULT_WIDGET_FILE = path.resolve(process.cwd(), 'widget.json');

module.exports = function (options) {
  if (options.descriptor) {
    return processFile(options.descriptor);
  }

  return processFile(DEFAULT_WIDGET_FILE)
    .catch(function (error) {
      if (error.code === 'ENOENT') {
        return;
      }

      throw error;
    });
};

function statFile (path) {
  return statFileAsync(path).return(path);
}

function processFile (path, options) {
  return statFile(path)
    .then(function () {
      return readFileAsync(path);
    })
    .then(function (contents) {
      let descriptor;

      try {
        descriptor = JSON.parse(contents.toString());
      } catch (e) {
        // include path to the offending file
        throw new Error(`${path} ${e.message}`);
      }

      if (!descriptor.id) {
        throw new Error('missing id in descriptor file');
      }

      if (!descriptor.src && !descriptor.srcdoc) {
        throw new Error('missing src and srcdoc in descriptor file');
      }

      return descriptor;
    });
}
