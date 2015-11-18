'use strict';

var _ = require('lodash');

module.exports = class Widget {
  constructor (options, context) {
    this.options = options;
    this.context = context;
  }

  static all (options, context) {
    return context.http.get(options, context);
  }

  save () {
    let verb = 'post';
    let options = _.pick(this.options, ['spaceId', 'id', 'version']);
    let payload = _.pick(this.options, ['src', 'srcdoc', 'name', 'fieldTypes', 'sidebar']);

    options.payload = payload;

    if (options.id) {
      verb = 'put';
    }

    return this.context.http[verb](options, this.context);
  }

  read () {
    return this.context.http.get(this.options, this.context);
  }

  delete () {
    return this.context.http.delete(this.options, this.context);
  }
};
