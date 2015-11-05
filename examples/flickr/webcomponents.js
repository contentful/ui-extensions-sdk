module.exports = function () {
  var host = document.getElementById('webcomponent-container');
  var root = host.createShadowRoot();
  var template = document.querySelector('template');
  root.appendChild(document.importNode(template.content, true));
};
