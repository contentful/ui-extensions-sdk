/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	/*globals window __webpack_hash__ */
	if(false) {
		var lastData;
		var upToDate = function upToDate() {
			return lastData.indexOf(__webpack_hash__) >= 0;
		};
		var check = function check() {
			module.hot.check(true, function(err, updatedModules) {
				if(err) {
					if(module.hot.status() in {
							abort: 1,
							fail: 1
						}) {
						console.warn("[HMR] Cannot apply update. Need to do a full reload!");
						console.warn("[HMR] " + err.stack || err.message);
						window.location.reload();
					} else {
						console.warn("[HMR] Update failed: " + err.stack || err.message);
					}
					return;
				}
	
				if(!updatedModules) {
					console.warn("[HMR] Cannot find update. Need to do a full reload!");
					console.warn("[HMR] (Probably because of restarting the webpack-dev-server)");
					window.location.reload();
					return;
				}
	
				if(!upToDate()) {
					check();
				}
	
				require("./log-apply-result")(updatedModules, updatedModules);
	
				if(upToDate()) {
					console.log("[HMR] App is up to date.");
				}
	
			});
		};
		var addEventListener = window.addEventListener ? function(eventName, listener) {
			window.addEventListener(eventName, listener, false);
		} : function(eventName, listener) {
			window.attachEvent("on" + eventName, listener);
		};
		addEventListener("message", function(event) {
			if(typeof event.data === "string" && event.data.indexOf("webpackHotUpdate") === 0) {
				lastData = event.data;
				if(!upToDate() && module.hot.status() === "idle") {
					console.log("[HMR] Checking for updates on the server...");
					check();
				}
			}
		});
		console.log("[HMR] Waiting for update signal from WDS...");
	} else {
		throw new Error("[HMR] Hot Module Replacement is disabled.");
	}


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(3);
	
	__webpack_require__(7)();
	
	var cfApi = __webpack_require__(8)('quantity');
	
	var iframeWidget = __webpack_require__(10);
	
	var iframe = __webpack_require__(9)({
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
	  for (var i = 0; i < value; i++) {
	    valueNode = document.createElement('span');
	    valueNode.classList.add('value');
	    valueNode.innerHTML = cfApi.fields.get('emoji').getValue();
	    docFrag.appendChild(valueNode);
	  }
	
	  var observer = new MutationObserver(function (mutations) {
	    mutations.forEach(function (mutation) {
	      if (mutation.target === field && mutation.type == 'childList') {
	        Array.prototype.slice.apply(mutation.addedNodes).forEach(function (node, index) {
	          setTimeout(function () {
	            node.classList.add('value-visible');
	          }, 150 * index);
	        });
	      }
	    });
	    observer.disconnect();
	  });
	
	  observer.observe(field, { attributes: true, childList: true, characterData: true });
	  field.appendChild(docFrag);
	});
	
	cfApi.fields.addObserver(function (changes) {
	  changes.forEach(function (change) {
	    console.log(change);
	    if (change.type === 'update') {
	      if (change.name == 'quantity') {
	        renderedQuantity.innerHTML = change.object.quantity;
	      }
	      if (change.name == 'emoji') {
	        renderedEmoji.innerHTML = change.object.emoji;
	      }
	    }
	  });
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(4);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./styles.css", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./styles.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports
	
	
	// module
	exports.push([module.id, "iframe {\n  border: none;\n}\n\n#field {\n  width: 95%;\n}\n\n.value {\n  opacity: 0;\n  transition: opacity 0.2s ease-in;\n}\n\n.value.value-visible {\n  opacity: 1;\n}\n\n.content {\n  display: flex;\n}\n\n#log {\n  margin-left: auto;\n}\n", ""]);
	
	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0;
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function createStyleElement() {
		var styleElement = document.createElement("style");
		var head = getHeadElement();
		styleElement.type = "text/css";
		head.appendChild(styleElement);
		return styleElement;
	}
	
	function createLinkElement() {
		var linkElement = document.createElement("link");
		var head = getHeadElement();
		linkElement.rel = "stylesheet";
		head.appendChild(linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement());
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement();
			update = updateLink.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement();
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				styleElement.parentNode.removeChild(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function () {
	  var host = document.getElementById('webcomponent-container');
	  var root = host.createShadowRoot();
	  var template = document.querySelector('template');
	  root.appendChild(document.importNode(template.content, true));
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var iframe = __webpack_require__(9);
	
	var allFieldsObservers = [];
	var fieldsData = {
	  emoji: '👻',
	  quantity: 0
	};
	
	var fields = {};
	for (var name in fieldsData) {
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
	module.exports = function (fieldId) {
	  var field = fields[fieldId];
	  var api = {
	    field: field,
	
	    fields: {
	      getAll: function getAll() {
	        return fields;
	      },
	
	      get: function get(fieldId) {
	        return fields[fieldId];
	      },
	
	      addObserver: function addObserver(fn) {
	        allFieldsObservers.push(fn);
	      }
	    },
	
	    dialog: {
	      open: function open(dialogWidget) {
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

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = function (params) {
	  var src = params.src;
	  var api = params.api;
	
	  var iframe = document.createElement('iframe');
	
	  var currentSize = { height: 0, width: 0 };
	
	  iframe.setAttribute('seamless', 'seamless');
	  iframe.setAttribute('sandbox', 'allow-scripts');
	
	  iframe.srcdoc = src;
	
	  var observer = new MutationObserver(function (mutations) {
	    mutations.forEach(function (mutation) {
	      var body = getIframeBody();
	      if (body.offsetHeight !== currentSize.height || body.offsetWidth !== currentSize.width) {
	        setIframeSize();
	      }
	    });
	  });
	
	  iframe.addEventListener('load', function () {
	    observer.observe(iframe.contentWindow.document.body, { attributes: true, childList: true, subtree: true });
	    iframe.contentWindow.cf = api;
	    var ev = new Event('ready');
	    iframe.contentWindow.dispatchEvent(ev);
	    setTimeout(setIframeSize, 100);
	  });
	
	  function setIframeSize() {
	    var body = getIframeBody();
	    currentSize.height = body.offsetHeight;
	    iframe.setAttribute('height', body.offsetHeight + 30 + 'px');
	    currentSize.width = body.offsetWidth;
	    iframe.setAttribute('width', body.offsetWidth + 30 + 'px');
	  }
	
	  function getIframeBody() {
	    return iframe.contentWindow.document.body;
	  }
	
	  return iframe;
	};

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<!DOCTYPE html>\n<html><head>\n<style>\n  #emoji {\n    height: 250px;\n    transition: height 0.5s ease-in;\n  }\n</style>\n</head><body>\n<p id=\"emoji\"></p>\n<input id=\"amount\" type=\"text\" value=\"1\" />\n<button id=\"add\">Add</button>\n<button id=\"dialog\">Dialog</button>\n<script src=\"/cf_api.js\" charset=\"utf-8\"></script>\n<script>\n  /*\n  window.addEventListener('ready', function () {\n    var button = document.getElementById('add');\n    var dialog = document.getElementById('dialog');\n    var amount = document.getElementById('amount');\n    var emoji = document.getElementById('emoji');\n    emoji.innerHTML = window.cf.fields.get('emoji').getValue()\n    window.cf.fields.get('emoji').addObserver(function (value) {\n      emoji.innerHTML = value;\n    });\n    button.addEventListener('click', function () {\n      window.cf.field.setValue(amount.value);\n    });\n\n    dialog.addEventListener('click', function () {\n      window.cf.dialog.open('<p>dialogs</p>');\n    });\n\n    setTimeout(function () {\n      console.log('setting height')\n      emoji.style.height = '300px';\n    }, 2000);\n  });\n  */\n</script>\n</body>\n</html>\n";

/***/ }
/******/ ]);
//# sourceMappingURL=app.bundle.js.map