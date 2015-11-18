'use strict';

var Widget = require('../widget');

module.exports = function (options, context) {
  if (!options.version) {
    if (!options.force) {
      throw new Error('to delete without version use the --force flag');
    }

    return new Widget(options, context).read()
      .catch(function () {
        console.error('Failed to delete the widget');
        process.exit(1);
      })
      .then(function (response) {
        let version = response.sys.version;
        options.version = version;

        return new Widget(options, context).delete()
          .catch(function () {
            console.error('Failed to delete the widget');
            process.exit(1);
          });
      });
  } else {
    return new Widget(options, context).delete()
    .catch(function () {
      console.error('Failed to delete the widget');
      process.exit(1);
    });
  }
};
