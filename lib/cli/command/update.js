'use strict';

var Bluebird = require('bluebird');
var fs = require('fs');
var Widget = require('../widget');

var readFile = Bluebird.promisify(fs.readFile);

module.exports = function (options, context) {
  if (options.file) {
    readFile(options.file).then(function (contents) {
      options.bundle = contents.toString();

      if (!options.version) {
        new Widget(options, context).read()
          .catch(function () {
            console.error('Failed to update the widget');
            process.exit(1);
          })
          .then(function (response) {
            response = JSON.parse(response);
            let version = response.sys.version;
            options.version = version;

            return new Widget(options, context).save()
            .then(function (widget) {
              console.log(widget);
            })
            .catch(function () {
              console.error('Failed to update the widget');
              process.exit(1);
            });
          });
      } else {
        new Widget(options, context).save()
        .then(function (widget) {
          console.log(widget);
        })
        .catch(function () {
          console.error('Failed to update the widget');
          process.exit(1);
        });
      }
    });
  } else {
    if (!options.version) {
      new Widget(options, context).read()
        .catch(function () {
          console.error('Failed to update the widget');
          process.exit(1);
        })
        .then(function (response) {
          response = JSON.parse(response);
          let version = response.sys.version;
          options.version = version;

          return new Widget(options, context).save()
            .then(function (widget) {
              console.log(widget);
            })
            .catch(function () {
              console.error('Failed to update the widget');
              process.exit(1);
            });
        });
    } else {
      new Widget(options, context).save()
      .then(function (widget) {
        console.log(widget);
      })
      .catch(function () {
        console.error('Failed to update the widget');
        process.exit(1);
      });
    }
  }
};
