require('./styles.css');

require('./webcomponents')();

var cfApi = require('./cf_api')('quantity');

var iframeWidget = require('./widget/widget.html');

var iframe = require('./iframe_wrapper')({
  src: iframeWidget,
  api: cfApi
});

document.getElementById('iframe-container').appendChild(iframe);

var field = document.getElementById('field');
var emoji = document.getElementById('emoji');
var useEmoji = document.getElementById('useEmoji');
var renderedQuantity = document.getElementById('renderedQuantity');
var renderedEmoji = document.getElementById('renderedEmoji');

useEmoji.addEventListener('click', function () {
  cfApi.fields.get('emoji').setValue(emoji.value);
});

cfApi.fields.get('quantity').addObserver(function (value) {
  var docFrag = new DocumentFragment();
  var valueNode;
  for(var i=0; i<value; i++){
    valueNode = document.createElement('span');
    valueNode.classList.add('value');
    valueNode.innerHTML = cfApi.fields.get('emoji').getValue();
    docFrag.appendChild(valueNode);
  }

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if(mutation.target === field && mutation.type == 'childList'){
        Array.prototype.slice.apply(mutation.addedNodes).forEach(function (node, index) {
          setTimeout(function () {
            node.classList.add('value-visible');
          }, 150 * index);
        })
      }
    });
    observer.disconnect();
  });

  observer.observe(field, { attributes: true, childList: true, characterData: true });
  field.appendChild(docFrag);
});

cfApi.fields.addObserver(function (changes) {
  changes.forEach(function (change) {
    console.log(change)
    if(change.type === 'update'){
      if(change.name == 'quantity'){
        renderedQuantity.innerHTML = change.object.quantity;
      }
      if(change.name == 'emoji'){
        renderedEmoji.innerHTML = change.object.emoji;
      }
    }
  });
});
