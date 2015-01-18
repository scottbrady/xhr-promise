var Promise, XMLHttpRequestPromise, extend;

Promise = require('bluebird');

extend = require('extend');


/*
 * Module to wrap an XMLHttpRequest in a promise.
 */

module.exports = XMLHttpRequestPromise = (function() {
  function XMLHttpRequestPromise() {}


  /*
   * XMLHttpRequestPromise.send(options) -> Promise
   * - options (Object): URL, method, data, etc.
   *
   * Create the XHR object and wire up event handlers to use a promise.
   */

  XMLHttpRequestPromise.prototype.send = function(options) {
    var defaults;
    defaults = {
      method: 'GET',
      data: null,
      headers: [],
      async: true,
      username: null,
      password: null
    };
    options = extend({}, options, defaults);
    return new Promise((function(_this) {
      return function(resolve, reject) {
        var e, header, value, xhr, _ref;
        if (!XMLHttpRequest) {
          _this._handleError('error', reject, null, "browser doesn't support XMLHttpRequest");
          return;
        }
        if (typeof options.url !== 'string' || options.url.length === 0) {
          _this._handleError('error', reject, null, 'URL is a required parameter');
          return;
        }
        _this._xhr = xhr = new XMLHttpRequest;
        xhr.onload = function() {
          _this._detachWindowUnload();
          return resolve({
            status: xhr.status,
            statusText: xhr.statusText,
            responseText: xhr.responseText,
            headers: xhr.getAllResponseHeaders(),
            xhr: xhr
          });
        };
        xhr.onerror = function() {
          return _this._handleError('error', reject);
        };
        xhr.ontimeout = function() {
          return _this._handleError('timeout', reject);
        };
        xhr.onabort = function() {
          return _this._handleError('abort', reject);
        };
        _this._attachWindowUnload();
        xhr.open(options.method, options.url, options.async, options.username, options.password);
        _ref = options.headers;
        for (header in _ref) {
          value = _ref[header];
          xhr.setRequestHeader(header, value);
        }
        try {
          return xhr.send(options.data);
        } catch (_error) {
          e = _error;
          return _this._handleError('error', reject, null, e.toString());
        }
      };
    })(this));
  };


  /*
   * XMLHttpRequestPromise.getXHR() -> XMLHttpRequest
   */

  XMLHttpRequestPromise.prototype.getXHR = function() {
    return this._xhr;
  };


  /*
   * XMLHttpRequestPromise._handleError(reason, reject, status, statusText)
   * - reason (String)
   * - reject (Function)
   * - status (String)
   * - statusText (String)
   */

  XMLHttpRequestPromise.prototype._handleError = function(reason, reject, status, statusText) {
    this._detachWindowUnload();
    return reject({
      reason: reason,
      status: status || this._xhr.status,
      statusText: statusText || this._xhr.statusText,
      xhr: this._xhr
    });
  };


  /*
   * XMLHttpRequestPromise._attachWindowUnload()
   *
   * Fix for IE 9 and IE 10
   * Internet Explorer freezes when you close a webpage during an XHR request
   * https://support.microsoft.com/kb/2856746
   *
   */

  XMLHttpRequestPromise.prototype._attachWindowUnload = function() {
    this._unloadHandler = this._handleWindowUnload.bind(this);
    if (window.attachEvent) {
      return window.attachEvent('onunload', this._unloadHandler);
    }
  };


  /*
   * XMLHttpRequestPromise._detachWindowUnload()
   */

  XMLHttpRequestPromise.prototype._detachWindowUnload = function() {
    if (window.detachEvent) {
      return window.detachEvent('onunload', this._unloadHandler);
    }
  };


  /*
   * XMLHttpRequestPromise._handleWindowUnload()
   */

  XMLHttpRequestPromise.prototype._handleWindowUnload = function() {
    return this._xhr.abort();
  };

  return XMLHttpRequestPromise;

})();
