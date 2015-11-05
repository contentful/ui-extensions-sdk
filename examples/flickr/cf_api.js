var iframe = require('./iframe_wrapper');

var allFieldsObservers = [];
var fieldsData = {
  emoji: '👻',
  quantity: 0
};

var fields = {};
for(var name in fieldsData){
  fields[name] = new Field(name);
}

Object.observe(fieldsData, function (changes) {
  allFieldsObservers.forEach(function (fn) {
    fn(changes);
  });
});

function Field(id) {
  this.id = id;
  this.observers = [];
}

Field.prototype.setValue = function (value) {
  fieldsData[this.id] = value;
  this.observers.forEach(function (fn) {
    fn(value);
  });
};

Field.prototype.getValue = function () {
  return fieldsData[this.id];
};

Field.prototype.addObserver = function (fn) {
  this.observers.push(fn);
};

// TODO We probably want to freeze this
module.exports = function(fieldId){
  var field = fields[fieldId];
  var api = {
    field: field,

    fields: {
      getAll: function () {
        return fields;
      },

      get: function (fieldId) {
        return fields[fieldId];
      },

      addObserver: function (fn) {
        allFieldsObservers.push(fn);
      }
    },

    dialog: {
      open: function (dialogWidget) {
        var container = document.createElement('div');
        container.classList.add('modal-dialog-background');

        var content = document.createElement('div');
        content.classList.add('modal-dialog');

        content.appendChild(iframe(dialogWidget, api));
        container.appendChild(content);
        document.body.appendChild(container);
      }
    }
  };

  return api;
};
