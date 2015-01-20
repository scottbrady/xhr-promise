[![Build Status](https://travis-ci.org/scottbrady/xhr-promise.svg?branch=master)](https://travis-ci.org/scottbrady/xhr-promise)
[![NPM version](https://badge.fury.io/js/xhr-promise.svg)](http://badge.fury.io/js/xhr-promise)

# xhr-promise

This module wraps the [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
object with [Promise/A+](https://promisesaplus.com/) compliant promises.
The promise implementation is provided by the [bluebird](https://github.com/petkaantonov/bluebird) promise library.

## Browser support

Because xhr-promise uses the XMLHttpRequest object this library will work with
IE7+, Safari 5+ and evergreen browsers (Chrome and Firefox).  You should [read the
bluebird docs](https://github.com/petkaantonov/bluebird#browser-support) for
workarounds with promises and IE 7 and IE 8.

## Installation

This package is available on npm as:

```
npm install xhr-promise
```

## Example

The xhr-promise code in this example does the same thing as the following XMLHttpRequest code.

xhr-promise code:

```
var XMLHttpRequestPromise = require('xhr-promise');

var xhrPromise = new XMLHttpRequestPromise();

xhrPromise.send({
    method: 'POST',
    url: 'https://example.com/form',
    data: 'foo=bar'
  })
  .then(function (results) {
    if (results.status !== 200) {
      throw new Error('request failed');
    }
    // ...
  })
  .catch(function (e) {
    console.error('XHR error');
    // ...
  });
```

XMLHttpRequest code:

```
var xhr = new XMLHttpRequest();

xhr.onload = function () {
  if (xhr.status !== 200) {
    throw new Error('request failed');
  }
  // ...
}

xhr.onerror = function () {
  console.error('XHR error');
  // ...
}

xhr.open('POST', 'https://example.com/form', true);

xhr.send('foo=bar');
```

## Access to the XMLHttpRequest object

You still have direct access to the XMLHttpRequest instance if you want to
access or manipulate the object state yourself.

```
var XMLHttpRequestPromise = require('xhr-promise');

var xhrPromise = new XMLHttpRequestPromise();

xhrPromise.send({...})
  .then(function () {
    var xhr = xhrPromise.getXHR();
  });
```

## Running the tests

```
$ npm install
$ grunt test
```

## License

MIT