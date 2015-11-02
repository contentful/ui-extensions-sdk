'use strict';

var _ = require('lodash');

module.exports = class Widget {
  constructor (options, context) {
    this.options = options;
    this.context = context;
  }

  save () {
    let bundle = this.options.bundle;
    let url = this.options.url;
    let verb = 'post';
    let options = _.pick(this.options, ['space', 'id', 'version']);

    if (options.id) {
      verb = 'put';
    }

    if (url) {
      options = _.extend(options, {payload: {src: url}});
      return this.context.http[verb](options, this.context);
    } else {
      options = _.extend(options, {payload: {srcdoc: bundle}});
      return this.context.http[verb](options, this.context);
    }
  }

  read () {
    return this.context.http.get(this.options, this.context);
  }

  delete () {
    return this.context.http.delete(this.options, this.context);
  }
};
