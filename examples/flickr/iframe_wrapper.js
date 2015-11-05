module.exports = function (params) {
  var src = params.src;
  var api = params.api;

  var iframe = document.createElement('iframe');

  var currentSize = {height: 0, width: 0};

  iframe.setAttribute('seamless', 'seamless');
  iframe.setAttribute('sandbox', 'allow-scripts');

  iframe.srcdoc = src;

  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      var body = getIframeBody();
      if(body.offsetHeight !== currentSize.height || body.offsetWidth !== currentSize.width){
        setIframeSize();
      }
    });
  });

  iframe.addEventListener('load', function () {
    observer.observe(iframe.contentWindow.document.body, { attributes: true, childList: true, subtree: true });
    iframe.contentWindow.cf = api;
    var ev = new Event('ready');
    iframe.contentWindow.dispatchEvent(ev);
    setTimeout(setIframeSize, 100)
  });

  function setIframeSize() {
    var body = getIframeBody();
    currentSize.height = body.offsetHeight;
    iframe.setAttribute('height', body.offsetHeight+30+'px');
    currentSize.width = body.offsetWidth;
    iframe.setAttribute('width', body.offsetWidth+30+'px');
  }

  function getIframeBody() {
    return iframe.contentWindow.document.body;
  }

  return iframe;
};
