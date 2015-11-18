'use strict';

var Widget = require('../widget');

module.exports = function (options, context) {
  return new Widget(options, context).read()
    .then(function (widget) {
      console.log(JSON.stringify(widget));
    })
    .catch(function () {
      console.error('Failed to read the widget');
      process.exit(1);
    });
};
