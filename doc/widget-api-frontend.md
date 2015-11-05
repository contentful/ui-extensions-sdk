##Widget API

### Main API object
```
// Injected into the iframe/component/environment
window.cf;
```

### Field value API

Provides access to the field the widget is applied to.
- get field value
- set field value
- notifying mechanism for value updates (event emitter, observable)
```
var field = cf.field.getValue();
cf.field.setValue('value').then(...);
cf.field.addObserver(value => console.log('value changed', value)); // follows the Object.observe changes response format
```

### Widget options API
Provides access to the options that have been configured for this widget

- supply schema options (actually the schema should be provided to the server side Widget API when creating the widget, together with the widget source)
- get widget options values
- get help text

```
cf.widget.setOptionsSchema([
  { id: 'description', type: 'Text', name: 'Description' }
]);
cf.widget.getOptionValues(); // {description: 'This widget is pretteh'}
cf.widget.getHelpText();
```

### Space API

Provide access to Space entities and resources

```
cf.space.getEntry(id)
cf.space.getEntries(query)
cf.space.createEntry(contentTypeId, data)
cf.space.getAsset(id)
cf.space.getAssets(query)
cf.space.createAsset(data)
cf.space.getContentType(id)
cf.space.getContentTypes(query)
cf.space.createContentType(data)
cf.space.getLocale(id)
cf.space.getLocales(query)
cf.space.createLocale(data)
```

### Locales API
```
cf.locales // array with all locale codes
cf.currentFieldLocale // locale for the current field, might be good to put it under cf.field
```
### Document API

Provides access to other fields in the current entry.

- get another field in the current entry
would this be necessary or would the entries API be enough?
nope, beacuse speed and complexity
- notify of changes on other fields
- Important: we probably want to make sure we clone these objects from the parent page before we pass them down

```
cf.fields; // same content as cf.api.entries but comes straight from the currently loaded document and has a different API
cf.fields.getAll();
cf.fields.addObserver(values => console.log('some values changed', values)); // follows the Object.observe changes response format
cf.fields.get('locale', 'fieldId').addObserver(value => console.log('value changed', value)); // follows the Object.observe changes response format
cf.fields.get('locale', 'fieldId').set('locale', 'value');
```

### Dialog API

Allows the widget to create Dialogs on the parent page.

- open dialog window
  - which would potentially contain another iframe and this same API
  - there could be even a use case to call a dialog inside a dialog, for instance for confirmations, but we should somehow limit this
- submit dialog window
  - Used inside a dialog window to submit results back to its caller

```
// Most of these options lifted from the existing modal dialog component
cf.dialog.open({
  template: '<html>', // or a DOM object. Alternative, render method below
  render: function(dialogRoot, cf) {...}, // gets a dialogRoot DOM node and the same API we have here
  showCloseButton: true,
  showCancel: true,
  showConfirmation: true,
  cancelLabel: 'Cancel', // optional
  confirmationLabel: 'OK', //optional
  ignoreEnterKey: true,
  ignoreEscKey: true,
  ignorePageBackgroundClose: true
}).then(result => {
  console.log('User pressed ok', result);
}, error => {
  console.log('User was not ok', error);
});
// cf supplied to `render` method has additional methods
cf.dialog.submit(result);
cf.dialog.cancel(error);
```

### Parent window API
Providing functionality to warn the parent window of certain actions

- resizeWidget (probably only for iframe case)
  - Tells the parent window the widget should be resized
  - We could detect changes with MutationObservers and resize the window, but if an animation is used then the actual size change happens after the mutation event is fired
  - If we allow the user to manually notify the parent window of the change, we can resize it accordingly.

```
cf.parentWindow.resizeWidget();
```

##Appendix

### Observers

Following same response format as:
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe)

addObserver argument for single element:
```
{
  object: {}, // changed object after changes
  type: '', // add, update or delete
  oldValue: {} // value before the changes
}
```
addObserver argument for collection:

```
[
  {
    name: '', // name of the changed field
    object: {}, // changed object after changes
    type: '', // add, update or delete
    oldValue: {} // value before the changes
  }
]
```

### Server API

Endpoint for creating widgets

Note: some of these options are already part of the current widget system

Needs to get the following parameters in its payload

- Name
- Description
- Icon
- Field Types: types this widget can be applied to
- isFocusable: if the widget should be automatically focused when field is set as title
- rendersHelpText: don't render the help text after to the widget as the widget will take care of it
  - This is useful for widgets such as the entry link editor, where content gets added and the help text might not be rendered right next to the input field
- Widget source: just some plain HTML
- Options Schema: JSON object defining the Schema of which options can be provided
- (Maybe) Width/Height: we can detect the size but it but if the user provides this we could just use it.

### Document Status and Permissions

As of this writing this has not yet been defined in the Widget API, but widgets would also need to be aware of the current document status (if the document is disabled) and perhaps the reasons. Also, we will probably have field level permissions, and the widgets would also need to be aware of this.
 