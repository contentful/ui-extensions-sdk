'use strict';

var path = require('path');
var Bluebird = require('bluebird');
var exec = require('child_process').exec;

module.exports = function command (subcommand, options) {
  let binary = path.resolve(__dirname, '../../../bin/contentful-widget');

  // TODO incllude the --host option in the exec call
  // to remove duplication from the tests
  return new Bluebird(function (resolve, reject) {
    exec(`${binary} ${subcommand}`, options, function (error, stdout, stderr) {
      if (error) {
        return reject({error: error, stderr: stderr});
      }

      resolve(stdout);
    });
  });
};
