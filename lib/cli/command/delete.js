'use strict';

var Widget = require('../widget');
var error = require('./utils/error');

var formatError = error.format('delete');

module.exports = function (options, context) {
  if (!options.version) {
    if (!options.force) {
      throw new Error('to delete without version use the --force flag');
    }

    return new Widget(options, context).read()
      .catch(function (err) {
        console.error(formatError(err.message));
        process.exit(1);
      })
      .then(function (response) {
        let version = response.sys.version;
        options.version = version;

        return new Widget(options, context).delete()
          .catch(function (err) {
            console.error(formatError(err.message));
            process.exit(1);
          });
      });
  } else {
    return new Widget(options, context).delete()
    .catch(function (err) {
      console.error(formatError(err.message));
      process.exit(1);
    });
  }
};
