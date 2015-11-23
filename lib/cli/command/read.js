'use strict';

var Widget = require('../widget');
var error = require('./utils/error');

var formatError = error.format('read');

module.exports = function (options, context) {
  if (options.id) {
    return new Widget(options, context).read()
      .then(function (widget) {
        console.log(JSON.stringify(widget));
      })
      .catch(function (err) {
        console.error(formatError(err.message));
        process.exit(1);
      });
  } else if (options.all) {
    return Widget.all(options, context)
      .then(function (widgets) {
        console.log(JSON.stringify(widgets));
      })
      .catch(function (err) {
        console.error(formatError(err.message));
        process.exit(1);
      });
  }

  console.error(formatError('missing one of --id or --all options'));
  process.exit(1);
};
