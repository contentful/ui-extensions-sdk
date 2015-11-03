'use strict';

var parentMessageDispatcher = require('./parentMessageDispatcher');
var messageDispatcher;

function FieldsCollection(fields, locales) {
  this.observers = [];
  this.fields = {};
  for(var fieldApiName in fields){
    this.fields[fieldApiName] = new Field(fieldApiName, fields[fieldApiName], locales);
  }
}

FieldsCollection.prototype._update = function (fields) {
  var field;
  for(var fieldApiName in fields){
    field = fields[fieldApiName];
    for(var locale in field){
      this.fields[fieldApiName]._setValue(locale, field[locale]);
    }
  }
};

FieldsCollection.prototype.getAll = function () {
  return this.fields;
};

FieldsCollection.prototype.get = function (fieldApiName) {
  return this.fields[fieldApiName];
};

FieldsCollection.prototype.addObserver = function (fn) {
  this.observers.push(fn);
};

function Field(fieldApiName, fieldData, locales) {
  this.observers = [];
  this.data = {};
  this.apiName = fieldApiName;
  locales.forEach(function (locale) {
    Field.prototype._setValue.call(this, locale, fieldData && fieldData[locale]);
  }, this);
}

Field.prototype.getValue = function (locale) {
  return this.data[locale];
};

Field.prototype._setValue = function (locale, value) {
  this.data[locale] = value || null;
};

Field.prototype.setValue = function (locale, value) {
  this._setValue(locale, value);
  messageDispatcher.send('setFieldValue', {
    apiName: this.apiName,
    value: this.data
  });
};

Field.prototype.addObserver = function (fn) {
  this.observers.push(fn);
};

function CurrentField(fieldApiName, fieldData, locales, currentLocale) {
  Field.call(this, fieldApiName, fieldData, locales);
  this._currentLocale = currentLocale;
}

CurrentField.prototype = Object.create(Field.prototype);

CurrentField.prototype.getValue = function () {
  return this.data[this._currentLocale];
};

CurrentField.prototype._setValue = function (value) {
  Field.prototype._setValue.call(this, this._currentLocale, value);
};

CurrentField.prototype.setValue = function (value) {
  this._setValue(value);
  messageDispatcher.send('setWidgetFieldValue', {
    value: this.data[this._currentLocale]
  });
};

module.exports = {
  create: function (params) {
    messageDispatcher = parentMessageDispatcher.get();
    return new FieldsCollection(
      params.fields,
      params.locales
    );
  },
  createCurrentField: function (params){
    return new CurrentField(
      params.field.apiName,
      params.field.data,
      params.locales,
      params.fieldLocale
    );
  }
};
