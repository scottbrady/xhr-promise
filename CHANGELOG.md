# xhr-promise Changelog

## Version 2.0.0, December 1st, 2015

* Upgrade module dependencies for Node 4 support.
* Make ES6 compatible module, use shims in wrapper. (zeekay)
* Parses Content-Type header to handle encoding when parsing JSON (Mingan).
* Add support for withCredentials (Mingan).

## Version 1.2.0, June 22nd, 2015

* Updated dependencies.
* Simplified setting the default content header.
* Content-Type header can be set manually for requests with data.

## Version 1.1.0, January 22nd, 2015

* Added header and JSON parsing.
* Send the correct header when data is present.
* Include the actual response URL after following redirects.
* Added mocha tests.

## Version 1.0.0, January 18th, 2015

* Initial release.
