'use strict';

var Widget = require('../widget');

module.exports = function (options, context) {
  new Widget(options, context).read()
  .then(function (widget) {
    console.log(widget);
  })
  .catch(function () {
    console.error('Failed to read the widget');
    process.exit(1);
  });
};
