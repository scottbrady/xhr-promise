var XMLHttpRequestPromise = require('xhr-promise');

// Based on the github/fetch tests
// https://github.com/github/fetch/tree/master/test

describe('request', function () {
  it('should resolve promise on 500 error', function (done) {
    new XMLHttpRequestPromise()
      .send({url: '/boom'})
      .then(function (response) {
        response.status.should.eql(500);
        response.responseText.should.eql('boom');
      })
      .catch(function () {
        should.fail('should not have rejected promise');
      })
      .finally(function () {
        done();
      });
  });

  it('should reject promise on network error', function (done) {
    new XMLHttpRequestPromise()
      .send({url: '/error'})
      .then(function (response) {
        should.fail('should not have resolved promise');
      })
      .catch(function (error) {
        error.reason.should.eql('error');
      })
      .finally(function () {
        done();
      });
  });

  it('should send request headers', function (done) {
    new XMLHttpRequestPromise()
      .send({
        url: '/request',
        headers: {
          'Accept': 'application/json',
          'X-Test': '42'
        }
      })
      .then(function (response) {
        response.status.should.eql(200);
        response.statusText.should.eql('OK');
        response.responseText.headers['accept'].should.eql('application/json');
        response.responseText.headers['x-test'].should.eql('42');
        done();
      });
  });

  it('should not set withCredentials by default', function (done) {
    new XMLHttpRequestPromise()
      .send({
        url: '/with_credentials'
      })
      .then(function (response) {
        response.xhr.withCredentials.should.eql(false);
        done();
      });
  });

  it('should allow set withCredentials', function (done) {
    new XMLHttpRequestPromise()
      .send({
        url: '/with_credentials',
        withCredentials: true
      })
      .then(function (response) {
        response.xhr.withCredentials.should.eql(true);
        done();
      });
  });

  it('should populate response body', function (done) {
    new XMLHttpRequestPromise()
      .send({url: '/hello'})
      .then(function (response) {
        response.status.should.eql(200);
        response.responseText.should.eql('hi');
        done();
      });
  });

  it('should parse response headers', function (done) {
    new XMLHttpRequestPromise()
      .send({url: '/headers?' + Date.now()})
      .then(function (response) {
        response.headers['date'].should.eql('Mon, 13 Oct 2014 21:02:27 GMT');
        response.headers['content-type'].should.eql('text/html; charset=utf-8');
        done();
      });
  });

  it('should handle binary data', function (done) {
    new XMLHttpRequestPromise()
      .send({url: '/binary'})
      .then(function (response) {
        response.responseText.length.should.eql(256);
        done();
      });
  });

  it('should set default content-type header during POST if not specified by the user', function (done) {
    new XMLHttpRequestPromise()
      .send({
        method: 'POST',
        url: '/request',
        data: 'foo=bar'
      })
      .then(function (response) {
        response.responseText.method.should.eql('POST');
        response.responseText.data.should.eql('foo=bar');
        response.responseText.headers['content-type'].should.eql('application/x-www-form-urlencoded; charset=UTF-8');
        done();
      });
  });

  it('should set content-type header during POST specified by the user', function (done) {
    new XMLHttpRequestPromise()
      .send({
        method: 'POST',
        url: '/request',
        data: '{"foo":"bar"}',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function (response) {
        response.responseText.method.should.eql('POST');
        response.responseText.data.should.eql('{"foo":"bar"}');
        response.responseText.headers['content-type'].should.eql('application/json');
        done();
      });
  });

  it('should handle JSON parse error', function (done) {
    new XMLHttpRequestPromise()
      .send({url: '/json-error'})
      .catch(function (error) {
        error.reason.should.eql('parse')
        error.statusText.should.eql('invalid JSON response')
        done();
      });
  });

  it('should handle 204 No Content response', function (done) {
    new XMLHttpRequestPromise()
      .send({url: '/empty'})
      .then(function (response) {
        response.status.should.eql(204);
        response.responseText.should.eql('');
        done();
      });
  });

  it('should support HTTP GET', function (done) {
    new XMLHttpRequestPromise()
      .send({url: '/request'})
      .then(function (response) {
        response.responseText.method.should.eql('GET');
        response.responseText.data.should.eql('');
        done();
      });
  });

  it('should support HTTP POST', function (done) {
    new XMLHttpRequestPromise()
      .send({
        method: 'POST',
        url: '/request',
        data: 'foo=bar'
      })
      .then(function (response) {
        response.responseText.method.should.eql('POST');
        response.responseText.data.should.eql('foo=bar');
        response.responseText.headers['content-type'].should.eql('application/x-www-form-urlencoded; charset=UTF-8');
        done();
      });
  });

  it('should support HTTP PUT', function (done) {
    new XMLHttpRequestPromise()
      .send({
        method: 'PUT',
        url: '/request',
        data: 'foo=bar'
      })
      .then(function (response) {
        response.responseText.method.should.eql('PUT');
        response.responseText.data.should.eql('foo=bar');
        response.responseText.headers['content-type'].should.eql('application/x-www-form-urlencoded; charset=UTF-8');
        done();
      });
  });

  it('should support HTTP DELETE', function (done) {
    new XMLHttpRequestPromise()
      .send({method: 'DELETE', url: '/request'})
      .then(function (response) {
        response.responseText.method.should.eql('DELETE');
        response.responseText.data.should.eql('');
        done();
      });
  });

  [ 301, 302, 303, 307 ].forEach(function (httpStatus) {
    it('should handle ' + httpStatus + ' redirect response', function (done) {
      new XMLHttpRequestPromise()
        .send({url: '/redirect/' + httpStatus})
        .then(function (response) {
          response.status.should.eql(200);
          response.url.should.containEql('/hello');
          response.responseText.should.eql('hi');
          done();
        });
    });
  });
});
