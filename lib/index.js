if (global.Promise == null) {
  global.Promise = require('zousan');
}

if (Object.assign == null) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: require('object-assign')
  });
}

module.exports = require('./xhr-promise');
