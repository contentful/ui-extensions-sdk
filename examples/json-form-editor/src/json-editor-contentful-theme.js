'use strict';

JSONEditor.defaults.themes.contentful = (function (JSONEditor) {

  return JSONEditor.AbstractTheme.extend({
    getFormControl: el(function (el, label, input, description) {
      el.className = 'cf-form-field';
    }),
    getIndentedPanel: function () {
      var el = document.createElement('div');
      el.className = 'jfe-indented-panel';
      return el;
    },
    getFormInputField: el(function (el, type) {
      el.className = 'cf-form-input';
    }),
    getFormInputDescription: el(function (el, text) {
      el.className = 'cf-form-hint';
    }),
    getFormInputLabel: el(function (el, text) {
      el.className = 'jfe-label'
    }),
    afterInputReady: function (input) {
      input.cfFormField = input.cfFormField || this.closest(input, '.cf-form-field');
    },
    getButton: el(function (el, text, icon, title) {
      el.className = text.match(/save/i) ? 'cf-btn-primary' : 'cf-btn-secondary';
    }),
    getHeader: el(function (el, text) {
      if (text instanceof HTMLElement) {
        text.className = 'jfe-label'
      }
      var el2 = document.createElement('div');
      el2.innerHTML = el.innerHTML;
      return el2;
    }),
    getButtonHolder: el(function (el) {
      el.className = 'jfe-button-holder';
    }),
    getSelectInput: el(function (el, options) {
      el.className = 'cf-form-input';
    }),
    getSwitcher: function (options) {
      var el = this.getSelectInput(options);
      el.className += ' jfe-switcher';
      return el;
    },
    getErrorMessage: function (text) {
      var el = document.createElement('div');
      el.appendChild(document.createTextNode(text));
      el.className = 'cf-field-error';
      return el;
    },
    addInputError: function (input, text) {
      if (!input.cfFormField) {
        return;
      }
      if (!input.cfFieldError) {
        input.cfFieldError = document.createElement('div');
        input.cfFieldError.className = 'cf-field-error';
        input.cfFormField.appendChild(input.cfFieldError);
      }
      input.cfFieldError.textContent = text;
      input.className += ' cf-has-error'
    },
    removeInputError: function (input) {
      if (!input.cfFieldError) {
        return;
      }
      input.cfFormField.removeChild(input.cfFieldError);
      delete input.cfFieldError;
      input.cfFormField.className = input.cfFormField.className.replace(/\s?cf-field-error/g, '');
      input.className = input.className.replace(/\s?cf-has-error/g, '');
    }
  });

  function el (fn) {
    return function (el) {
      var el = this._super.apply(this, arguments);
      var callbackArgs = [el].concat(Array.prototype.slice.call(arguments));
      return fn.apply(this, callbackArgs) || el;
    };
  }

}(JSONEditor));
