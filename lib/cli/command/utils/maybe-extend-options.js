'use strict';

var _ = require('lodash');
var Bluebird = require('bluebird');

function findMissingOptions (options, specs) {
  let missing = [];

  _.forEach(specs, function (spec) {
    if (_.isPlainObject(spec)) {
      if (spec.or) {
        let deep = findMissingOptions(options, spec.or);

        if (deep.length === spec.or.length) {
          deep = deep.join(' or ');
          missing = missing.concat(deep);
        }
      }
    } else if (options[spec] === undefined) {
      missing.push(spec);
    }
  });

  return missing;
}

module.exports = function (options, descriptor, required) {
  return Bluebird.try(function () {
    options = _.defaults(options, descriptor);

    let missing = findMissingOptions(options, required);

    if (missing.length > 0) {
      let keys = missing.join(', ');

      throw new Error(`no value given for: ${keys}`);
    }
  });
};
