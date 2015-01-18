Promise = require 'bluebird'
extend  = require 'extend'

###
# Module to wrap an XMLHttpRequest in a promise.
###
module.exports = class XMLHttpRequestPromise

  ##########################################################################
  ## Public methods #######################################################
  ########################################################################

  ###
  # XMLHttpRequestPromise.send(options) -> Promise
  # - options (Object): URL, method, data, etc.
  #
  # Create the XHR object and wire up event handlers to use a promise.
  ###
  send: (options) ->
    defaults =
      method   : 'GET'
      data     : null
      headers  : []
      async    : true
      username : null
      password : null

    options = extend({}, options, defaults)

    new Promise (resolve, reject) =>
      if !XMLHttpRequest
        @_handleError 'error', reject, null, "browser doesn't support XMLHttpRequest"
        return

      if typeof options.url isnt 'string' || options.url.length is 0
        @_handleError 'error', reject, null, 'URL is a required parameter'
        return

      # XMLHttpRequest is supported by IE 7+
      @_xhr = xhr = new XMLHttpRequest

      # success handler
      xhr.onload = =>
        @_detachWindowUnload()

        resolve(
          status       : xhr.status
          statusText   : xhr.statusText
          responseText : xhr.responseText
          headers      : xhr.getAllResponseHeaders()
          xhr          : xhr
        )

      # error handlers
      xhr.onerror   = => @_handleError 'error', reject
      xhr.ontimeout = => @_handleError 'timeout', reject
      xhr.onabort   = => @_handleError 'abort', reject

      @_attachWindowUnload()

      xhr.open(options.method, options.url, options.async, options.username, options.password)

      for header, value of options.headers
        xhr.setRequestHeader(header, value)

      try
        xhr.send(options.data)
      catch e
        @_handleError 'error', reject, null, e.toString()

  ###
  # XMLHttpRequestPromise.getXHR() -> XMLHttpRequest
  ###
  getXHR: () ->
    @_xhr

  ##########################################################################
  ## Psuedo-private methods ###############################################
  ########################################################################

  ###
  # XMLHttpRequestPromise._handleError(reason, reject, status, statusText)
  # - reason (String)
  # - reject (Function)
  # - status (String)
  # - statusText (String)
  ###
  _handleError: (reason, reject, status, statusText) ->
    @_detachWindowUnload()

    reject(
      reason     : reason
      status     : status || @_xhr.status
      statusText : statusText || @_xhr.statusText
      xhr        : @_xhr
    )

  ###
  # XMLHttpRequestPromise._attachWindowUnload()
  #
  # Fix for IE 9 and IE 10
  # Internet Explorer freezes when you close a webpage during an XHR request
  # https://support.microsoft.com/kb/2856746
  #
  ###
  _attachWindowUnload: () ->
    @_unloadHandler = @_handleWindowUnload.bind(@)
    window.attachEvent 'onunload', @_unloadHandler if window.attachEvent

  ###
  # XMLHttpRequestPromise._detachWindowUnload()
  ###
  _detachWindowUnload: () ->
    window.detachEvent 'onunload', @_unloadHandler if window.detachEvent

  ###
  # XMLHttpRequestPromise._handleWindowUnload()
  ###
  _handleWindowUnload: () ->
    @_xhr.abort()
