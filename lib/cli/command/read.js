'use strict';

var Widget = require('../widget');

module.exports = function (options, context) {
  if (options.id) {
    return new Widget(options, context).read()
      .then(function (widget) {
        console.log(JSON.stringify(widget));
      })
      .catch(function () {
        console.error('Failed to read the widget');
        process.exit(1);
      });
  } else if (options.all) {
    return Widget.all(options, context)
      .then(function (widgets) {
        console.log(JSON.stringify(widgets));
      })
      .catch(function (e) {
        console.error(`Failed to read the widgets: ${e.message}`);
        process.exit(1);
      });
  }

  console.error('Failed to read the widgets: missing one of --id or --all options');
  process.exit(1);
};
