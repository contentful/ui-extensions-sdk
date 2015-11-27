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

    let payloadProperties = ['src', 'srcdoc', 'name', 'fieldTypes', 'sidebar'];
    let payloadData = _.pick(this.options, payloadProperties);

    options.payload = buildAPIPayload(payloadData);

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

function buildAPIPayload (data) {
  let widget = data;

  if (data.fieldTypes) {
    widget.fieldTypes = data.fieldTypes.map(fieldType);
  }

  return {widget: widget};
}

function fieldType (type) {
  type = _.capitalize(type.toLowerCase());

  if (type === 'Assets') {
    return arrayFieldType('Link', 'Asset');
  }

  if (type === 'Entries') {
    return arrayFieldType('Link', 'Entry');
  }

  if (type === 'Asset' || type === 'Entry') {
    return {type: 'Link', linkType: type};
  }

  if (type === 'Symbols') {
    return arrayFieldType('Symbol');
  }

  return {type: type};
}

function arrayFieldType (type, linkType) {
  let array = {type: 'Array', items: {type: type}};

  if (linkType) {
    array.items.linkType = linkType;
  }

  return array;
}
