'use strict';

/*
* Custom translation widget using the widget API
* Translates text from the default locale to every other locales present in a space
* Uses the Yandex Translator Service - https://tech.yandex.com/translate/
*/

+function() {
  var widget = {};

  // Hardcoding secrets for now
  widget.apiKey = 'trnsl.1.1.20151015T080754Z.fac48f0d13a96c3a.c0c58058288c42ba40de8aec2b36d9d86c3adb1d';


  widget.events = {
    initialize: function() {
      window.addEventListener('cfWidgetReady', this.widgetReady);
    },

    widgetReady: function(ev) {
      // Define API
      widget.cfApi = ev.detail;
      // Create HTML elements
      widget.elements = {
        input: createElement('input', {type: 'text'}),
        defaultLanguage: createElement('div'),
        populateAll: createElement('input', {type: 'submit', value: 'Populate all other locales'}, createElement('div'))
      };

      // Attach event listeners
      widget.elements.input.addEventListener('input', widget.events.textUpdated);
      widget.elements.populateAll.addEventListener('click', widget.events.doTranslations);

      // Watch for changes on the default language field
      if (widget.cfApi.defaultLocale !== widget.cfApi.currentFieldLocale) {
        widget.cfApi.fields.addObserver(widget.events.fieldsUpdated);
      }

      // Populate current values
      widget.events.fieldsUpdated(widget.cfApi.fields);

      var isDefaultLocale = widget.cfApi.defaultLocale === widget.cfApi.currentFieldLocale;

      // Hide Populate button on non-default locales
      if (widget.cfApi.defaultLocale !== widget.cfApi.currentFieldLocale) {
        widget.uiUpdate.hideElement(widget.elements.populateAll);
      }
      // setIframeSize method adds 30px
      widget.cfApi.window.setSize(300, isDefaultLocale ? 50 : 15);
    },

    fieldsUpdated: function() {
      // Sometimes getValue() returns an empty object instead of null
      var currentValue = typeof widget.cfApi.field.getValue() !== 'object' ? widget.cfApi.field.getValue() : null;

      // Show translate button when there is a value in the default locale
      widget.uiUpdate.updateInput(currentValue);

      // Show or hide translate button
      if (widget.cfApi.defaultLocale === widget.cfApi.currentFieldLocale) {
        widget.uiUpdate.enableElement(widget.elements.populateAll, !!currentValue);
      } else {
        // Save value
        widget.cfApi.field.setValue(currentValue);
      }
    },

    textUpdated: function() {
      var val = widget.elements.input.value.toString();
      widget.cfApi.field.setValue(val);
      widget.events.fieldsUpdated(widget.cfApi.fields);
    },

    doTranslations: function(ev) {
      ev.preventDefault();
      var currentLocale = widget.cfApi.currentFieldLocale;
      var idx = widget.cfApi.locales.indexOf(currentLocale);
      var arr = widget.cfApi.locales.slice();
      arr.splice(idx, 1);
      var languagePair;
      var text = widget.cfApi.field.getValue();

      arr.forEach(function(language) {
        languagePair = getYandexCode(currentLocale, language);
        getTranslation(text, languagePair, language);
      });
    }
  };

  widget.uiUpdate = {
    updateInput: function(text) {
      // because sometimes getValue() returns an empty object instead of null...
      text = (typeof text === 'object') ? null : text;
      widget.elements.input.value = text;
    },
    enableElement: function(element, enabled) {
      element.className = (enabled === true) ? '' : 'disabled';
    },
    hideElement: function(element) {
      element.style.display = 'none';
    }
  };

  function callTranslateApi(text, lang) {
    return new Promise(function(resolve, reject) {
      var endpoint = 'https://translate.yandex.net/api/v1.5/tr.json/translate?key='
        + widget.apiKey + '&lang=' + lang + '&text=' + encodeURIComponent(text);

      var xhr = new XMLHttpRequest();

      xhr.open('GET', endpoint, true);
      xhr.send();
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(JSON.parse(xhr.response));
        } else {
          setTimeout(function() {
            reject();
          }, 200);
        }
      };
    });
  }

  function createElement(elem, opts, parent) {
    var e = document.createElement(elem);
    var prop;
    for (prop in opts) {
      e[prop] = opts[prop];
    }
    parent = parent || document.body;
    parent.appendChild(e);
    return e;      
  }

  // Call the translate API and insert the text into the correct locale
  function getTranslation(text, lang, targetLocale) {
    callTranslateApi(text, lang)
    .then(function(resp) {
      var translation = resp.text.join(' ');
      var apiName = widget.cfApi.field.apiName;
      widget.cfApi.fields.fields[apiName].setValue(targetLocale, translation);
    });
  }

  // Map Contentful locales to Yandex locale code
  function getYandexCode(fromLocale, toLocale) {
    function getCode(cfLocale) {
      var translationMap = {
        'en-US': 'en',
        'de-DE': 'de',
        'fr-FR': 'fr'
      };
      return translationMap[cfLocale] ? translationMap[cfLocale] : cfLocale.substring(0,2);
    }
    return getCode(fromLocale) + '-' + getCode (toLocale);
  }

  // Debounce 
  // http://davidwalsh.name/javascript-debounce-function
  function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }



  widget.events.initialize();

}();
