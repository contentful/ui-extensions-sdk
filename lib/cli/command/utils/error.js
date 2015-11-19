'use strict';

exports.format = function (command) {
  return function (msg) {
    return `Failed to ${command} the widget: ${msg}`;
  };
};
