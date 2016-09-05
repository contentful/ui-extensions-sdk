(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["contentfulWidget"] = factory();
	else
		root["contentfulWidget"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
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

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.init = undefined;
	
	var _initialize = __webpack_require__(1);
	
	var _initialize2 = _interopRequireDefault(_initialize);
	
	var _fieldLocale = __webpack_require__(57);
	
	var _fieldLocale2 = _interopRequireDefault(_fieldLocale);
	
	var _window = __webpack_require__(58);
	
	var _window2 = _interopRequireDefault(_window);
	
	var _entry = __webpack_require__(59);
	
	var _entry2 = _interopRequireDefault(_entry);
	
	var _space = __webpack_require__(61);
	
	var _space2 = _interopRequireDefault(_space);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var init = exports.init = (0, _initialize2.default)(createWidgetAPI);
	
	function createWidgetAPI(channel, _ref) {
	  var entry = _ref.entry;
	  var locales = _ref.locales;
	  var field = _ref.field;
	  var fieldInfo = _ref.fieldInfo;
	  var contentType = _ref.contentType;
	
	  return {
	    locales: locales,
	    field: new _fieldLocale2.default(channel, field),
	    entry: (0, _entry2.default)(channel, entry, fieldInfo, locales.default),
	    space: (0, _space2.default)(channel),
	    window: (0, _window2.default)(channel),
	    contentType: contentType
	  };
	}

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = initializeApi;
	
	var _channel = __webpack_require__(2);
	
	var _channel2 = _interopRequireDefault(_channel);
	
	var _signal = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function initializeApi(apiCreator) {
	  var channel = new _channel2.default(null, window.parent);
	  var apiInitCallbacks = new _signal.Signal();
	  var createdApi = void 0;
	
	  var removeHandler = channel.addHandler('connect', function (params) {
	    removeHandler();
	    channel.sourceId = params.id;
	
	    createdApi = apiCreator(channel, params);
	
	    apiInitCallbacks.dispatch(createdApi);
	    apiInitCallbacks = null;
	  });
	
	  return function init(initCb) {
	    document.addEventListener('focus', setActive(true), true);
	    document.addEventListener('blur', setActive(false), true);
	
	    if (createdApi) {
	      initCb(createdApi);
	    } else {
	      apiInitCallbacks.attach(initCb);
	    }
	
	    function setActive(isActive) {
	      return function () {
	        return channel.call('setActive', isActive);
	      };
	    }
	  };
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _yaku = __webpack_require__(3);
	
	var _yaku2 = _interopRequireDefault(_yaku);
	
	var _signal = __webpack_require__(4);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Channel = function () {
	  function Channel(sourceId, targetWindow) {
	    var _this = this;
	
	    _classCallCheck(this, Channel);
	
	    this.sourceId = sourceId;
	    this.targetWindow = targetWindow; // contentful webapp window
	    this._messageCount = 0;
	    this._messageHandlers = {};
	    this._responseHandlers = {};
	
	    // window refers to iframe contentWindow
	    window.addEventListener('message', function (event) {
	      _this._handleMessage(event.data);
	    });
	  }
	
	  // call method with name `method` exposed by contentful web app `window`
	
	
	  _createClass(Channel, [{
	    key: 'call',
	    value: function call(method) {
	      var _this2 = this;
	
	      for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        params[_key - 1] = arguments[_key];
	      }
	
	      var messageId = this._send(method, params);
	      return new _yaku2.default(function (resolve, reject) {
	        _this2._responseHandlers[messageId] = { resolve: resolve, reject: reject };
	      });
	    }
	  }, {
	    key: 'send',
	    value: function send(method) {
	      for (var _len2 = arguments.length, params = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        params[_key2 - 1] = arguments[_key2];
	      }
	
	      this._send(method, params);
	    }
	  }, {
	    key: 'addHandler',
	    value: function addHandler(method, handler) {
	      if (!(method in this._messageHandlers)) {
	        this._messageHandlers[method] = new _signal.Signal();
	      }
	      return this._messageHandlers[method].attach(handler);
	    }
	  }, {
	    key: '_handleMessage',
	    value: function _handleMessage(message) {
	      if (message.method) {
	        var method = message.method;
	        var _params = message.params;
	
	        var handlers = this._messageHandlers[method];
	        if (handlers) {
	          handlers.dispatch.apply(handlers, _toConsumableArray(_params));
	        }
	      } else {
	        var id = message.id;
	
	        var responseHandler = this._responseHandlers[id];
	        if (!responseHandler) {
	          return;
	        }
	        if ('result' in message) {
	          responseHandler.resolve(message.result);
	        } else if ('error' in message) {
	          responseHandler.reject(message.error);
	        }
	        delete this._responseHandlers[id];
	      }
	    }
	  }, {
	    key: '_send',
	    value: function _send(method, params) {
	      var messageId = this._messageCount++;
	
	      this.targetWindow.postMessage({
	        source: this.sourceId,
	        id: messageId,
	        method: method,
	        params: params
	      }, '*');
	
	      return messageId;
	    }
	  }]);
	
	  return Channel;
	}();
	
	exports.default = Channel;

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	 Yaku v0.11.9
	 (c) 2015 Yad Smood. http://ysmood.org
	 License MIT
	*/
	(function () {
	    "use strict";
	
	    var $nil
	    , root = typeof global === "object" ? global : window
	    , isLongStackTrace = false
	
	    , $rejected = 0
	    , $resolved = 1
	    , $pending = 2
	
	    , $promiseTrace = "_pt"
	    , $settlerTrace = "_st"
	
	    , $fromPrevious = "From previous event:"
	    , $unhandledRejection = "unhandledRejection";
	
	    /**
	     * This class follows the [Promises/A+](https://promisesaplus.com) and
	     * [ES6](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-promise-objects) spec
	     * with some extra helpers.
	     * @param  {Function} executor Function object with three arguments resolve, reject and
	     * the promise itself.
	     * The first argument fulfills the promise, the second argument rejects it.
	     * We can call these functions, once our operation is completed.
	     * The `this` context of the executor is the promise itself, it can be used to add custom handlers,
	     * such as `abort` or `progress` helpers.
	     * @example
	     * Here's an abort example.
	     * ```js
	     * var Promise = require('yaku');
	     * var p = new Promise((resolve, reject) => {
	     *     var tmr = setTimeout(resolve, 3000);
	     *     this.abort = (reason) => {
	     *         clearTimeout(tmr);
	     *         reject(reason);
	     *     };
	     * });
	     *
	     * p.abort(new Error('abort'));
	     * ```
	     * @example
	     * Here's a progress example.
	     * ```js
	     * var Promise = require('yaku');
	     * var p = new Promise((resolve, reject) => {
	     *     var self = this;
	     *     var count = 0;
	     *     var all = 100;
	     *     var tmr = setInterval(() => {
	     *         try {
	     *             self.progress && self.progress(count, all);
	     *         } catch (err) {
	     *             reject(err);
	     *         }
	     *
	     *         if (count < all)
	     *             count++;
	     *         else {
	     *             resolve();
	     *             clearInterval(tmr);
	     *         }
	     *     }, 1000);
	     * });
	     *
	     * p.progress = (curr, all) => {
	     *     console.log(curr, '/', all);
	     * };
	     * ```
	     */
	    var Yaku = module.exports = function Promise (executor) {
	        var self = this,
	            err;
	
	        if (isLongStackTrace) self[$promiseTrace] = genTraceInfo();
	
	        if (executor !== $noop) {
	            err = genTryCatcher(executor, self)(
	                genSettler(self, $resolved),
	                genSettler(self, $rejected)
	            );
	
	            if (err === $tryErr)
	                settlePromise(self, $rejected, err.e);
	        }
	    };
	
	    Yaku.default = Yaku;
	
	    extendPrototype(Yaku, {
	        /**
	         * Appends fulfillment and rejection handlers to the promise,
	         * and returns a new promise resolving to the return value of the called handler.
	         * @param  {Function} onFulfilled Optional. Called when the Promise is resolved.
	         * @param  {Function} onRejected  Optional. Called when the Promise is rejected.
	         * @return {Yaku} It will return a new Yaku which will resolve or reject after
	         * @example
	         * the current Promise.
	         * ```js
	         * var Promise = require('yaku');
	         * var p = Promise.resolve(10);
	         *
	         * p.then((v) => {
	         *     console.log(v);
	         * });
	         * ```
	         */
	        then: function then (onFulfilled, onRejected) {
	            return addHandler(this, newEmptyYaku(), onFulfilled, onRejected);
	        },
	
	        /**
	         * The `catch()` method returns a Promise and deals with rejected cases only.
	         * It behaves the same as calling `Promise.prototype.then(undefined, onRejected)`.
	         * @param  {Function} onRejected A Function called when the Promise is rejected.
	         * This function has one argument, the rejection reason.
	         * @return {Yaku} A Promise that deals with rejected cases only.
	         * @example
	         * ```js
	         * var Promise = require('yaku');
	         * var p = Promise.reject(new Error("ERR"));
	         *
	         * p['catch']((v) => {
	         *     console.log(v);
	         * });
	         * ```
	         */
	        "catch": function (onRejected) {
	            return this.then($nil, onRejected);
	        },
	
	        // Default state
	        _state: $pending,
	
	        // The number of current promises that attach to this Yaku instance.
	        _pCount: 0,
	
	        // The parent Yaku.
	        _pre: null,
	
	        // A unique type flag, it helps different versions of Yaku know each other.
	        _Yaku: 1
	    });
	
	    /**
	     * The `Promise.resolve(value)` method returns a Promise object that is resolved with the given value.
	     * If the value is a thenable (i.e. has a then method), the returned promise will "follow" that thenable,
	     * adopting its eventual state; otherwise the returned promise will be fulfilled with the value.
	     * @param  {Any} value Argument to be resolved by this Promise.
	     * Can also be a Promise or a thenable to resolve.
	     * @return {Yaku}
	     * @example
	     * ```js
	     * var Promise = require('yaku');
	     * var p = Promise.resolve(10);
	     * ```
	     */
	    Yaku.resolve = function resolve (val) {
	        return isYaku(val) ? val : settleWithX(newEmptyYaku(), val);
	    };
	
	    /**
	     * The `Promise.reject(reason)` method returns a Promise object that is rejected with the given reason.
	     * @param  {Any} reason Reason why this Promise rejected.
	     * @return {Yaku}
	     * @example
	     * ```js
	     * var Promise = require('yaku');
	     * var p = Promise.reject(new Error("ERR"));
	     * ```
	     */
	    Yaku.reject = function reject (reason) {
	        return settlePromise(newEmptyYaku(), $rejected, reason);
	    };
	
	    /**
	     * The `Promise.race(iterable)` method returns a promise that resolves or rejects
	     * as soon as one of the promises in the iterable resolves or rejects,
	     * with the value or reason from that promise.
	     * @param  {iterable} iterable An iterable object, such as an Array.
	     * @return {Yaku} The race function returns a Promise that is settled
	     * the same way as the first passed promise to settle.
	     * It resolves or rejects, whichever happens first.
	     * @example
	     * ```js
	     * var Promise = require('yaku');
	     * Promise.race([
	     *     123,
	     *     Promise.resolve(0)
	     * ])
	     * .then((value) => {
	     *     console.log(value); // => 123
	     * });
	     * ```
	     */
	    Yaku.race = function race (iterable) {
	        var iter, len, i = 0;
	
	        var p = newEmptyYaku(), item;
	
	        if (isArray(iterable)) {
	            len = iterable.length;
	            while (i < len) {
	                settleWithX(p, iterable[i++]);
	                if (p._state !== $pending) break;
	            }
	        } else {
	            iter = genIterator(iterable);
	            while (!(item = iter.next()).done) {
	                settleWithX(p, item.value);
	                if (p._state !== $pending) break;
	            }
	        }
	
	        return p;
	    };
	
	    /**
	     * The `Promise.all(iterable)` method returns a promise that resolves when
	     * all of the promises in the iterable argument have resolved.
	     *
	     * The result is passed as an array of values from all the promises.
	     * If something passed in the iterable array is not a promise,
	     * it's converted to one by Promise.resolve. If any of the passed in promises rejects,
	     * the all Promise immediately rejects with the value of the promise that rejected,
	     * discarding all the other promises whether or not they have resolved.
	     * @param  {iterable} iterable An iterable object, such as an Array.
	     * @return {Yaku}
	     * @example
	     * ```js
	     * var Promise = require('yaku');
	     * Promise.all([
	     *     123,
	     *     Promise.resolve(0)
	     * ])
	     * .then((values) => {
	     *     console.log(values); // => [123, 0]
	     * });
	     * ```
	     * @example
	     * Use with iterable.
	     * ```js
	     * var Promise = require('yaku');
	     * Promise.all((function * () {
	     *     yield 10;
	     *     yield new Promise(function (r) { setTimeout(r, 1000, "OK") });
	     * })())
	     * .then((values) => {
	     *     console.log(values); // => [123, 0]
	     * });
	     * ```
	     */
	    Yaku.all = function all (iterable) {
	        var p1 = newEmptyYaku()
	        , res = []
	        , item
	        , countDown = 0
	        , iter
	        , len;
	
	        function onRejected (reason) {
	            settlePromise(p1, $rejected, reason);
	        }
	
	        if (isArray(iterable)) {
	            len = iterable.length;
	            while (countDown < len) {
	                runAll(countDown, iterable[countDown++], p1, res, onRejected);
	            }
	        } else {
	            iter = genIterator(iterable);
	            while (!(item = iter.next()).done) {
	                runAll(countDown++, item.value, p1, res, onRejected);
	            }
	        }
	
	        onRejected._c = countDown;
	
	        if (!countDown) settlePromise(p1, $resolved, []);
	
	        return p1;
	    };
	
	    function runAll (i, el, p1, res, onRejected) {
	        Yaku.resolve(el).then(function (value) {
	            res[i] = value;
	            if (!--onRejected._c) settlePromise(p1, $resolved, res);
	        }, onRejected);
	    }
	
	    /**
	     * The ES6 Symbol object that Yaku should use, by default it will use the
	     * global one.
	     * @type {Object}
	     * @example
	     * ```js
	     * var core = require("core-js/library");
	     * var Promise = require("yaku");
	     * Promise.Symbol = core.Symbol;
	     * ```
	     */
	    Yaku.Symbol = root.Symbol || {};
	
	    /**
	     * Catch all possibly unhandled rejections. If you want to use specific
	     * format to display the error stack, overwrite it.
	     * If it is set, auto `console.error` unhandled rejection will be disabled.
	     * @param {Any} reason The rejection reason.
	     * @param {Yaku} p The promise that was rejected.
	     * @example
	     * ```js
	     * var Promise = require('yaku');
	     * Promise.onUnhandledRejection = (reason) => {
	     *     console.error(reason);
	     * };
	     *
	     * // The console will log an unhandled rejection error message.
	     * Promise.reject('my reason');
	     *
	     * // The below won't log the unhandled rejection error message.
	     * Promise.reject('v').catch(() => {});
	     * ```
	     */
	    Yaku.onUnhandledRejection = function (reason, p) {
	        var con = root.console;
	        if (con) {
	            var info = genStackInfo(reason, p);
	            con.error($unhandledRejection, info[0], info[1] || "");
	        }
	    };
	
	    /**
	     * It is used to enable the long stack trace.
	     * Once it is enabled, it can't be reverted.
	     * While it is very helpful in development and testing environments,
	     * it is not recommended to use it in production. It will slow down your
	     * application and waste your memory.
	     * @example
	     * ```js
	     * var Promise = require('yaku');
	     * Promise.enableLongStackTrace();
	     * ```
	     */
	    Yaku.enableLongStackTrace = function () {
	        isLongStackTrace = true;
	    };
	
	    /**
	     * Only Node has `process.nextTick` function. For browser there are
	     * so many ways to polyfill it. Yaku won't do it for you, instead you
	     * can choose what you prefer. For example, this project
	     * [setImmediate](https://github.com/YuzuJS/setImmediate).
	     * By default, Yaku will use `process.nextTick` on Node, `setTimeout` on browser.
	     * @type {Function}
	     * @example
	     * ```js
	     * var Promise = require('yaku');
	     * Promise.nextTick = fn => window.setImmediate(fn);
	     * ```
	     * @example
	     * You can even use sync resolution if you really know what you are doing.
	     * ```js
	     * var Promise = require('yaku');
	     * Promise.nextTick = fn => fn();
	     * ```
	     */
	    Yaku.nextTick = root.process ?
	        root.process.nextTick :
	        function (fn) { setTimeout(fn); };
	
	    // ********************** Private **********************
	
	    /**
	     * All static variable name will begin with `$`. Such as `$rejected`.
	     * @private
	     */
	
	    // ******************************* Utils ********************************
	
	    var $tryCatchFn
	    , $tryCatchThis
	    , $tryErr = { e: null }
	    , $noop = {};
	
	    function extendPrototype (src, target) {
	        for (var k in target) {
	            src.prototype[k] = target[k];
	        }
	        return src;
	    }
	
	    function isObject (obj) {
	        return typeof obj === "object";
	    }
	
	    function isFunction (obj) {
	        return typeof obj === "function";
	    }
	
	    function isArray (obj) {
	        return obj && typeof obj.length === "number";
	    }
	
	    /**
	     * Wrap a function into a try-catch.
	     * @private
	     * @return {Any | $tryErr}
	     */
	    function tryCatcher () {
	        try {
	            return $tryCatchFn.apply($tryCatchThis, arguments);
	        } catch (e) {
	            $tryErr.e = e;
	            return $tryErr;
	        }
	    }
	
	    /**
	     * Generate a try-catch wrapped function.
	     * @private
	     * @param  {Function} fn
	     * @return {Function}
	     */
	    function genTryCatcher (fn, self) {
	        $tryCatchFn = fn;
	        $tryCatchThis = self;
	        return tryCatcher;
	    }
	
	    /**
	     * Generate a scheduler.
	     * @private
	     * @param  {Integer}  initQueueSize
	     * @param  {Function} fn `(Yaku, Value) ->` The schedule handler.
	     * @return {Function} `(Yaku, Value) ->` The scheduler.
	     */
	    function genScheduler (initQueueSize, fn) {
	        /**
	         * All async promise will be scheduled in
	         * here, so that they can be execute on the next tick.
	         * @private
	         */
	        var fnQueue = Array(initQueueSize)
	        , fnQueueLen = 0;
	
	        /**
	         * Run all queued functions.
	         * @private
	         */
	        function flush () {
	            var i = 0;
	            while (i < fnQueueLen) {
	                fn(fnQueue[i], fnQueue[i + 1]);
	                fnQueue[i++] = $nil;
	                fnQueue[i++] = $nil;
	            }
	
	            fnQueueLen = 0;
	            if (fnQueue.length > initQueueSize) fnQueue.length = initQueueSize;
	        }
	
	        return function (v, arg) {
	            fnQueue[fnQueueLen++] = v;
	            fnQueue[fnQueueLen++] = arg;
	
	            if (fnQueueLen === 2) Yaku.nextTick(flush);
	        };
	    }
	
	    /**
	     * Generate a iterator
	     * @param  {Any} obj
	     * @return {Function}
	     */
	    function genIterator (obj) {
	        if (obj) {
	            var gen = obj[Yaku.Symbol.iterator];
	            if (isFunction(gen)) {
	                return gen.call(obj);
	            }
	
	            if (isFunction(obj.next)) {
	                return obj;
	            }
	        }
	        throw genTypeError("invalid_argument");
	    }
	
	    /**
	     * Generate type error object.
	     * @private
	     * @param  {String} msg
	     * @return {TypeError}
	     */
	    function genTypeError (msg) {
	        return new TypeError(msg);
	    }
	
	    function genTraceInfo (noTitle) {
	        return ((new Error()).stack || "").replace(
	            "Error",
	            noTitle ? "" : $fromPrevious
	        );
	    }
	
	
	    // *************************** Promise Helpers ****************************
	
	    /**
	     * Resolve the value returned by onFulfilled or onRejected.
	     * @private
	     * @param {Yaku} p1
	     * @param {Yaku} p2
	     */
	    var scheduleHandler = genScheduler(999, function (p1, p2) {
	        var x, handler;
	
	        // 2.2.2
	        // 2.2.3
	        handler = p1._state ? p2._onFulfilled : p2._onRejected;
	
	        // 2.2.7.3
	        // 2.2.7.4
	        if (handler === $nil) {
	            settlePromise(p2, p1._state, p1._value);
	            return;
	        }
	
	        // 2.2.7.1
	        x = genTryCatcher(callHanler)(handler, p1._value);
	        if (x === $tryErr) {
	            // 2.2.7.2
	            settlePromise(p2, $rejected, x.e);
	            return;
	        }
	
	        settleWithX(p2, x);
	    });
	
	    var scheduleUnhandledRejection = genScheduler(9, function (p) {
	        if (!hashOnRejected(p)) {
	            var process = root.process
	            , onunhandledrejection = root.onunhandledrejection
	            , reason = p._value;
	
	            if (process && process.listeners($unhandledRejection).length)
	                process.emit($unhandledRejection, reason, p);
	            else if (onunhandledrejection)
	                onunhandledrejection({ promise: p, reason: reason });
	            else
	                Yaku.onUnhandledRejection(reason, p);
	        }
	    });
	
	    function isYaku (val) { return val && val._Yaku; }
	
	    /**
	     * Create an empty promise.
	     * @private
	     * @return {Yaku}
	     */
	    function newEmptyYaku () { return new Yaku($noop); }
	
	    /**
	     * It will produce a settlePromise function to user.
	     * Such as the resolve and reject in this `new Yaku (resolve, reject) ->`.
	     * @private
	     * @param  {Yaku} self
	     * @param  {Integer} state The value is one of `$pending`, `$resolved` or `$rejected`.
	     * @return {Function} `(value) -> undefined` A resolve or reject function.
	     */
	    function genSettler (self, state) { return function (value) {
	        if (isLongStackTrace)
	            self[$settlerTrace] = genTraceInfo(true);
	
	        if (state === $resolved)
	            settleWithX(self, value);
	        else
	            settlePromise(self, state, value);
	    }; }
	
	    /**
	     * Link the promise1 to the promise2.
	     * @private
	     * @param {Yaku} p1
	     * @param {Yaku} p2
	     * @param {Function} onFulfilled
	     * @param {Function} onRejected
	     */
	    function addHandler (p1, p2, onFulfilled, onRejected) {
	        // 2.2.1
	        if (isFunction(onFulfilled))
	            p2._onFulfilled = onFulfilled;
	        if (isFunction(onRejected))
	            p2._onRejected = onRejected;
	
	        if (isLongStackTrace) p2._pre = p1;
	        p1[p1._pCount++] = p2;
	
	        // 2.2.6
	        if (p1._state !== $pending)
	            scheduleHandler(p1, p2);
	
	        // 2.2.7
	        return p2;
	    }
	
	    // iterate tree
	    function hashOnRejected (node) {
	        // A node shouldn't be checked twice.
	        if (node._umark)
	            return true;
	        else
	            node._umark = true;
	
	        var i = 0
	        , len = node._pCount
	        , child;
	
	        while (i < len) {
	            child = node[i++];
	            if (child._onRejected || hashOnRejected(child)) return true;
	        }
	    }
	
	    function genStackInfo (reason, p) {
	        var stackInfo = []
	        , stackStr
	        , i;
	
	        function trim (str) { return str.replace(/^\s+|\s+$/g, ""); }
	
	        function push (trace) {
	            return stackInfo.push(trim(trace));
	        }
	
	        if (isLongStackTrace && p[$promiseTrace]) {
	            if (p[$settlerTrace])
	                push(p[$settlerTrace]);
	
	            // Hope you guys could understand how the back trace works.
	            // We only have to iterate through the tree from the bottom to root.
	            (function iter (node) {
	                if (node) {
	                    iter(node._next);
	                    push(node[$promiseTrace]);
	                    iter(node._pre);
	                }
	            })(p);
	        }
	
	        stackStr = "\n" + stackInfo.join("\n");
	
	        function clean (stack, cleanPrev) {
	            if (cleanPrev && (i = stack.indexOf("\n" + $fromPrevious)) > 0)
	                stack = stack.slice(0, i);
	
	            return stack.replace(/^.+\/node_modules\/yaku\/.+\n?/mg, "");
	        }
	
	        return [(
	            reason ?
	                reason.stack ?
	                    clean(trim(reason.stack), true)
	                :
	                    reason
	            :
	                reason
	        ), clean(stackStr)];
	    }
	
	    function callHanler (handler, value) {
	        // 2.2.5
	        return handler(value);
	    }
	
	    /**
	     * Resolve or reject a promise.
	     * @private
	     * @param  {Yaku} p
	     * @param  {Integer} state
	     * @param  {Any} value
	     */
	    function settlePromise (p, state, value) {
	        var i = 0
	        , len = p._pCount
	        , p2
	        , stack;
	
	        // 2.1.2
	        // 2.1.3
	        if (p._state === $pending) {
	            // 2.1.1.1
	            p._state = state;
	            p._value = value;
	
	            if (state === $rejected) {
	                if (isLongStackTrace && value && value.stack) {
	                    stack = genStackInfo(value, p);
	                    value.stack = stack[0] + stack[1];
	                }
	
	                scheduleUnhandledRejection(p);
	            }
	
	            // 2.2.4
	            while (i < len) {
	                p2 = p[i++];
	
	                if (p2._state !== $pending) continue;
	
	                scheduleHandler(p, p2);
	            }
	        }
	
	        return p;
	    }
	
	    /**
	     * Resolve or reject promise with value x. The x can also be a thenable.
	     * @private
	     * @param {Yaku} p
	     * @param {Any | Thenable} x A normal value or a thenable.
	     */
	    function settleWithX (p, x) {
	        // 2.3.1
	        if (x === p && x) {
	            settlePromise(p, $rejected, genTypeError("promise_circular_chain"));
	            return p;
	        }
	
	        // 2.3.2
	        // 2.3.3
	        if (x != null && (isFunction(x) || isObject(x))) {
	            // 2.3.2.1
	            var xthen = genTryCatcher(getThen)(x);
	
	            if (xthen === $tryErr) {
	                // 2.3.3.2
	                settlePromise(p, $rejected, xthen.e);
	                return p;
	            }
	
	            if (isFunction(xthen)) {
	                if (isLongStackTrace && isYaku(x))
	                    p._next = x;
	
	                settleXthen(p, x, xthen);
	            }
	            else
	                // 2.3.3.4
	                settlePromise(p, $resolved, x);
	        } else
	            // 2.3.4
	            settlePromise(p, $resolved, x);
	
	        return p;
	    }
	
	    /**
	     * Try to get a promise's then method.
	     * @private
	     * @param  {Thenable} x
	     * @return {Function}
	     */
	    function getThen (x) { return x.then; }
	
	    /**
	     * Resolve then with its promise.
	     * @private
	     * @param  {Yaku} p
	     * @param  {Thenable} x
	     * @param  {Function} xthen
	     */
	    function settleXthen (p, x, xthen) {
	        // 2.3.3.3
	        var err = genTryCatcher(xthen, x)(function (y) {
	            // 2.3.3.3.3
	            if (x) {
	                x = null;
	
	                // 2.3.3.3.1
	                settleWithX(p, y);
	            }
	        }, function (r) {
	            // 2.3.3.3.3
	            if (x) {
	                x = null;
	
	                // 2.3.3.3.2
	                settlePromise(p, $rejected, r);
	            }
	        });
	
	        // 2.3.3.3.4.1
	        if (err === $tryErr && x) {
	            // 2.3.3.3.4.2
	            settlePromise(p, $rejected, err.e);
	            x = null;
	        }
	    }
	
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	__webpack_require__(5);
	
	var Signal = exports.Signal = function () {
	  function Signal() {
	    _classCallCheck(this, Signal);
	
	    this._id = 0;
	    this._listeners = {};
	  }
	
	  _createClass(Signal, [{
	    key: 'dispatch',
	    value: function dispatch() {
	      for (var key in this._listeners) {
	        var _listeners;
	
	        (_listeners = this._listeners)[key].apply(_listeners, arguments);
	      }
	    }
	  }, {
	    key: 'attach',
	    value: function attach(listener) {
	      var _this = this;
	
	      if (typeof listener !== 'function') {
	        throw new Error('listener function expected');
	      }
	      var id = this._id++;
	      this._listeners[id] = listener;
	      // return function that'll detach the listener
	      return function () {
	        return delete _this._listeners[id];
	      };
	    }
	  }]);
	
	  return Signal;
	}();
	
	var memArgsSymbol = Symbol('Private memoized arguments');
	
	var MemoizedSignal = exports.MemoizedSignal = function (_Signal) {
	  _inherits(MemoizedSignal, _Signal);
	
	  function MemoizedSignal() {
	    _classCallCheck(this, MemoizedSignal);
	
	    for (var _len = arguments.length, memoizedArgs = Array(_len), _key = 0; _key < _len; _key++) {
	      memoizedArgs[_key] = arguments[_key];
	    }
	
	    if (!memoizedArgs.length) {
	      throw new Error('Initial value to be memoized expected');
	    }
	
	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(MemoizedSignal).call(this));
	
	    _this2[memArgsSymbol] = memoizedArgs;
	    return _this2;
	  }
	
	  _createClass(MemoizedSignal, [{
	    key: 'dispatch',
	    value: function dispatch() {
	      var _get2;
	
	      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        args[_key2] = arguments[_key2];
	      }
	
	      this[memArgsSymbol] = args;
	      (_get2 = _get(Object.getPrototypeOf(MemoizedSignal.prototype), 'dispatch', this)).call.apply(_get2, [this].concat(args));
	    }
	  }, {
	    key: 'attach',
	    value: function attach(listener) {
	      /*
	       * attaching first so that we throw a sensible
	       * error if listener is not a function without
	       * duplication of is function check
	       */
	      var detachListener = _get(Object.getPrototypeOf(MemoizedSignal.prototype), 'attach', this).call(this, listener);
	
	      listener.apply(undefined, _toConsumableArray(this[memArgsSymbol]));
	      return detachListener;
	    }
	  }]);
	
	  return MemoizedSignal;
	}(Signal);

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	__webpack_require__(55);
	module.exports = __webpack_require__(12).Symbol;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(7)
	  , has            = __webpack_require__(8)
	  , DESCRIPTORS    = __webpack_require__(9)
	  , $export        = __webpack_require__(11)
	  , redefine       = __webpack_require__(21)
	  , META           = __webpack_require__(25).KEY
	  , $fails         = __webpack_require__(10)
	  , shared         = __webpack_require__(26)
	  , setToStringTag = __webpack_require__(27)
	  , uid            = __webpack_require__(22)
	  , wks            = __webpack_require__(28)
	  , wksExt         = __webpack_require__(29)
	  , wksDefine      = __webpack_require__(30)
	  , keyOf          = __webpack_require__(32)
	  , enumKeys       = __webpack_require__(45)
	  , isArray        = __webpack_require__(48)
	  , anObject       = __webpack_require__(15)
	  , toIObject      = __webpack_require__(35)
	  , toPrimitive    = __webpack_require__(19)
	  , createDesc     = __webpack_require__(20)
	  , _create        = __webpack_require__(49)
	  , gOPNExt        = __webpack_require__(52)
	  , $GOPD          = __webpack_require__(54)
	  , $DP            = __webpack_require__(14)
	  , $keys          = __webpack_require__(33)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;
	
	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;
	
	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};
	
	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};
	
	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};
	
	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });
	
	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(53).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(47).f  = $propertyIsEnumerable;
	  __webpack_require__(46).f = $getOwnPropertySymbols;
	
	  if(DESCRIPTORS && !__webpack_require__(31)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }
	
	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}
	
	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});
	
	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);
	
	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);
	
	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});
	
	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});
	
	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});
	
	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(13)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ },
/* 7 */
/***/ function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ },
/* 8 */
/***/ function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(10)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(7)
	  , core      = __webpack_require__(12)
	  , hide      = __webpack_require__(13)
	  , redefine  = __webpack_require__(21)
	  , ctx       = __webpack_require__(23)
	  , PROTOTYPE = 'prototype';
	
	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE]
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE] || (exports[PROTOTYPE] = {})
	    , key, own, out, exp;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    // export native or passed
	    out = (own ? target : source)[key];
	    // bind timers to global for call from export context
	    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // extend global
	    if(target)redefine(target, key, out, type & $export.U);
	    // export
	    if(exports[key] != out)hide(exports, key, exp);
	    if(IS_PROTO && expProto[key] != out)expProto[key] = out;
	  }
	};
	global.core = core;
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ },
/* 12 */
/***/ function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(14)
	  , createDesc = __webpack_require__(20);
	module.exports = __webpack_require__(9) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(15)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , toPrimitive    = __webpack_require__(19)
	  , dP             = Object.defineProperty;
	
	exports.f = __webpack_require__(9) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ },
/* 16 */
/***/ function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(9) && !__webpack_require__(10)(function(){
	  return Object.defineProperty(__webpack_require__(18)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(16)
	  , document = __webpack_require__(7).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(16);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ },
/* 20 */
/***/ function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(7)
	  , hide      = __webpack_require__(13)
	  , has       = __webpack_require__(8)
	  , SRC       = __webpack_require__(22)('src')
	  , TO_STRING = 'toString'
	  , $toString = Function[TO_STRING]
	  , TPL       = ('' + $toString).split(TO_STRING);
	
	__webpack_require__(12).inspectSource = function(it){
	  return $toString.call(it);
	};
	
	(module.exports = function(O, key, val, safe){
	  var isFunction = typeof val == 'function';
	  if(isFunction)has(val, 'name') || hide(val, 'name', key);
	  if(O[key] === val)return;
	  if(isFunction)has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
	  if(O === global){
	    O[key] = val;
	  } else {
	    if(!safe){
	      delete O[key];
	      hide(O, key, val);
	    } else {
	      if(O[key])O[key] = val;
	      else hide(O, key, val);
	    }
	  }
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, TO_STRING, function toString(){
	  return typeof this == 'function' && this[SRC] || $toString.call(this);
	});

/***/ },
/* 22 */
/***/ function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(24);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(22)('meta')
	  , isObject = __webpack_require__(16)
	  , has      = __webpack_require__(8)
	  , setDesc  = __webpack_require__(14).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(10)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	var global = __webpack_require__(7)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	var def = __webpack_require__(14).f
	  , has = __webpack_require__(8)
	  , TAG = __webpack_require__(28)('toStringTag');
	
	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(26)('wks')
	  , uid        = __webpack_require__(22)
	  , Symbol     = __webpack_require__(7).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';
	
	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};
	
	$exports.store = store;

/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(28);

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(7)
	  , core           = __webpack_require__(12)
	  , LIBRARY        = __webpack_require__(31)
	  , wksExt         = __webpack_require__(29)
	  , defineProperty = __webpack_require__(14).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ },
/* 31 */
/***/ function(module, exports) {

	module.exports = false;

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(33)
	  , toIObject = __webpack_require__(35);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(34)
	  , enumBugKeys = __webpack_require__(44);
	
	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(8)
	  , toIObject    = __webpack_require__(35)
	  , arrayIndexOf = __webpack_require__(39)(false)
	  , IE_PROTO     = __webpack_require__(43)('IE_PROTO');
	
	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(36)
	  , defined = __webpack_require__(38);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(37);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ },
/* 37 */
/***/ function(module, exports) {

	var toString = {}.toString;
	
	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ },
/* 38 */
/***/ function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(35)
	  , toLength  = __webpack_require__(40)
	  , toIndex   = __webpack_require__(42);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(41)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ },
/* 41 */
/***/ function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(41)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(26)('keys')
	  , uid    = __webpack_require__(22);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ },
/* 44 */
/***/ function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(33)
	  , gOPS    = __webpack_require__(46)
	  , pIE     = __webpack_require__(47);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ },
/* 46 */
/***/ function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ },
/* 47 */
/***/ function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(37);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(15)
	  , dPs         = __webpack_require__(50)
	  , enumBugKeys = __webpack_require__(44)
	  , IE_PROTO    = __webpack_require__(43)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';
	
	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(18)('iframe')
	    , i      = enumBugKeys.length
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(51).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write('<script>document.F=Object</script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};
	
	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};

/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(14)
	  , anObject = __webpack_require__(15)
	  , getKeys  = __webpack_require__(33);
	
	module.exports = __webpack_require__(9) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(7).document && document.documentElement;

/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(35)
	  , gOPN      = __webpack_require__(53).f
	  , toString  = {}.toString;
	
	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];
	
	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};
	
	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(34)
	  , hiddenKeys = __webpack_require__(44).concat('length', 'prototype');
	
	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(47)
	  , createDesc     = __webpack_require__(20)
	  , toIObject      = __webpack_require__(35)
	  , toPrimitive    = __webpack_require__(19)
	  , has            = __webpack_require__(8)
	  , IE8_DOM_DEFINE = __webpack_require__(17)
	  , gOPD           = Object.getOwnPropertyDescriptor;
	
	exports.f = __webpack_require__(9) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.3.6 Object.prototype.toString()
	var classof = __webpack_require__(56)
	  , test    = {};
	test[__webpack_require__(28)('toStringTag')] = 'z';
	if(test + '' != '[object z]'){
	  __webpack_require__(21)(Object.prototype, 'toString', function toString(){
	    return '[object ' + classof(this) + ']';
	  }, true);
	}

/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(37)
	  , TAG = __webpack_require__(28)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';
	
	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};
	
	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _signal = __webpack_require__(4);
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var FieldLocale = function () {
	  function FieldLocale(channel, _ref) {
	    var _this = this;
	
	    var id = _ref.id;
	    var locale = _ref.locale;
	    var value = _ref.value;
	    var type = _ref.type;
	    var isDisabled = _ref.isDisabled;
	
	    _classCallCheck(this, FieldLocale);
	
	    this.id = id;
	    this.locale = locale;
	    this.type = type;
	    this._value = value;
	    this._valueSignal = new _signal.MemoizedSignal(value);
	    this._isDisabledSignal = new _signal.MemoizedSignal(isDisabled);
	    this._channel = channel;
	
	    channel.addHandler('valueChanged', function (id, locale, value) {
	      if (id === _this.id && (!locale || locale === _this.locale) && _this._value !== value) {
	        _this._value = value;
	        _this._valueSignal.dispatch(value);
	      }
	    });
	
	    channel.addHandler('isDisabledChanged', function (isDisabled) {
	      _this._isDisabledSignal.dispatch(isDisabled);
	    });
	  }
	
	  _createClass(FieldLocale, [{
	    key: 'getValue',
	    value: function getValue() {
	      return this._value;
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(value) {
	      this._value = value;
	      return this._channel.call('setValue', this.id, this.locale, value);
	    }
	  }, {
	    key: 'removeValue',
	    value: function removeValue() {
	      this._value = undefined;
	      return this._channel.call('removeValue', this.id, this.locale);
	    }
	  }, {
	    key: 'setInvalid',
	    value: function setInvalid(isInvalid) {
	      return this._channel.call('setInvalid', isInvalid, this.locale);
	    }
	  }, {
	    key: 'onValueChanged',
	    value: function onValueChanged(handler) {
	      return this._valueSignal.attach(handler);
	    }
	  }, {
	    key: 'onIsDisabledChanged',
	    value: function onIsDisabledChanged(handler) {
	      return this._isDisabledSignal.attach(handler);
	    }
	  }]);
	
	  return FieldLocale;
	}();
	
	exports.default = FieldLocale;

/***/ },
/* 58 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createWindow;
	function createWindow(channel) {
	  var autoUpdateHeight = function autoUpdateHeight() {
	    self.updateHeight();
	  };
	  var observer = new MutationObserver(autoUpdateHeight);
	  var oldHeight = null;
	  var isAutoResizing = false;
	
	  var self = { startAutoResizer: startAutoResizer, stopAutoResizer: stopAutoResizer, updateHeight: updateHeight };
	  return self;
	
	  function startAutoResizer() {
	    self.updateHeight();
	    if (isAutoResizing) {
	      return;
	    }
	    isAutoResizing = true;
	    observer.observe(window.document.body, {
	      attributes: true, childList: true,
	      subtree: true, characterData: true
	    });
	    window.addEventListener('resize', autoUpdateHeight);
	  }
	
	  function stopAutoResizer() {
	    if (!isAutoResizing) {
	      return;
	    }
	    isAutoResizing = false;
	    observer.disconnect();
	    window.removeEventListener('resize', autoUpdateHeight);
	  }
	
	  function updateHeight(height) {
	    if (height == null) {
	      height = Math.ceil(document.documentElement.getBoundingClientRect().height);
	    }
	
	    if (height !== oldHeight) {
	      channel.send('setHeight', height);
	      oldHeight = height;
	    }
	  }
	}

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createEntry;
	
	var _signal = __webpack_require__(4);
	
	var _field = __webpack_require__(60);
	
	var _field2 = _interopRequireDefault(_field);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function createEntry(channel, entryData, fieldInfo, defaultLocale) {
	  var sys = entryData.sys;
	  var sysChanged = new _signal.MemoizedSignal(sys);
	
	  channel.addHandler('sysChanged', function (_sys) {
	    sys = _sys;
	    sysChanged.dispatch(sys);
	  });
	
	  var entry = {
	    fields: {},
	    getSys: function getSys() {
	      return sys;
	    },
	    onSysChanged: function onSysChanged(handler) {
	      return sysChanged.attach(handler);
	    }
	  };
	
	  fieldInfo.forEach(function (info) {
	    entry.fields[info.id] = new _field2.default(channel, info, defaultLocale);
	  });
	
	  return entry;
	}

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.UnknownLocaleError = undefined;
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _fieldLocale = __webpack_require__(57);
	
	var _fieldLocale2 = _interopRequireDefault(_fieldLocale);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }
	
	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Field = function () {
	  function Field(channel, info, defaultLocale) {
	    var _this = this;
	
	    _classCallCheck(this, Field);
	
	    this.id = info.id;
	    this.locales = info.locales;
	    this._defaultLocale = defaultLocale;
	    this._fieldLocales = {};
	
	    this.locales.forEach(function (locale) {
	      var value = info.values[locale];
	      _this._fieldLocales[locale] = new _fieldLocale2.default(channel, { id: _this.id, locale: locale, value: value });
	    });
	
	    assertHasLocale(this, defaultLocale);
	  }
	
	  _createClass(Field, [{
	    key: 'getValue',
	    value: function getValue(locale) {
	      return this._getFieldLocale(locale).getValue();
	    }
	  }, {
	    key: 'setValue',
	    value: function setValue(value, locale) {
	      return this._getFieldLocale(locale).setValue(value);
	    }
	  }, {
	    key: 'removeValue',
	    value: function removeValue(locale) {
	      return this.setValue(undefined, locale);
	    }
	  }, {
	    key: 'onValueChanged',
	    value: function onValueChanged(locale, handler) {
	      if (!handler) {
	        handler = locale;
	        locale = undefined;
	      }
	      return this._getFieldLocale(locale).onValueChanged(handler);
	    }
	  }, {
	    key: 'onIsDisabledChanged',
	    value: function onIsDisabledChanged(locale, handler) {
	      if (!handler) {
	        handler = locale;
	        locale = undefined;
	      }
	
	      return this._getFieldLocale(locale).onIsDisabledChanged(handler);
	    }
	  }, {
	    key: '_getFieldLocale',
	    value: function _getFieldLocale(locale) {
	      locale = locale || this._defaultLocale;
	      assertHasLocale(this, locale);
	      return this._fieldLocales[locale];
	    }
	  }]);
	
	  return Field;
	}();
	
	exports.default = Field;
	
	
	function assertHasLocale(field, locale) {
	  if (!field._fieldLocales[locale]) {
	    throw new UnknownLocaleError(field.id, locale);
	  }
	}
	
	var UnknownLocaleError = exports.UnknownLocaleError = function (_Error) {
	  _inherits(UnknownLocaleError, _Error);
	
	  function UnknownLocaleError(fieldId, locale) {
	    _classCallCheck(this, UnknownLocaleError);
	
	    var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(UnknownLocaleError).call(this));
	
	    _this2.message = 'Unknown locale "' + locale + '" for field "' + fieldId + '"';
	    _this2.fieldId = fieldId;
	    _this2.locale = locale;
	    return _this2;
	  }
	
	  return UnknownLocaleError;
	}(Error);

/***/ },
/* 61 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = createSpace;
	var spaceMethods = ['getContentType', 'getEntry', 'getAsset', 'getPublishedEntries', 'getPublishedAssets', 'getContentTypes', 'getEntries', 'getAssets', 'createContentType', 'createEntry', 'createAsset', 'updateContentType', 'updateEntry', 'updateAsset', 'deleteContentType', 'deleteEntry', 'deleteAsset', 'publishEntry', 'publishAsset', 'unpublishEntry', 'unpublishAsset', 'archiveEntry', 'archiveAsset', 'unarchiveEntry', 'unarchiveAsset', 'processAsset'];
	
	function createSpace(channel) {
	  var space = {};
	
	  spaceMethods.forEach(function (methodName) {
	    space[methodName] = function () {
	      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	        args[_key] = arguments[_key];
	      }
	
	      return channel.call('callSpaceMethod', methodName, args);
	    };
	  });
	
	  return space;
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=cf-extension-api.js.map