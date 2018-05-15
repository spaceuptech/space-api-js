var Api = require('../index').Api;
var assert = require('chai').assert;

describe('Client API', function () {
  describe('#constructor', function () {
    it('should set appId and url when both are provided', function () {
      let api = new Api('app', '/url');
      assert.equal(api.appId, 'app', 'api.appId equal `app`');
      assert.equal(api.url, '/url', 'api.url equal `/url`');
    });

    it('should set take default url when not provided', function () {
      let api = new Api('app');
      assert.equal(api.url, '/', 'api.url equal `/`');
    });

    it('should set the defualt options', function () {
      let options = {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      };

      let api = new Api('app');
      assert.equal(api.options.credentials, 'include', 'credentials equal `include`');
      assert.equal(api.options.headers['Content-Type'], 'application/json', 'Content-Type equal `application/json`');
    });

    it('should have a default token value', function () {
      let api = new Api('app');
      assert.equal(api.options.headers.Authorization, undefined, 'token equal `undefined`');
    });
  });

  describe('#setToken', function () {
    it('should set the token value', function () {
      let api = new Api('app');
      api.setToken('token');
      assert.equal(api.options.headers.Authorization, 'Bearer token', 'api.token equal `token`');
    });
  });

  describe('#setAppId', function () {
    it('should set the new app id', function () {
      let api = new Api('app1');
      api.setAppId('app2');
      assert.equal(api.appId, 'app2', 'api.appId equal `app2`');
    });
  });

  describe('#get', function () {
    it('should get a Get object instance', function () {
      let api = new Api('app');
      let get = api.get('col');
      assert.equal(get.constructor.name, 'Get', 'object is of type Get');
    });
  });

  describe('#insert', function () {
    it('should get an Insert object instance', function () {
      let api = new Api('app');
      let insert = api.insert('col');
      assert.equal(insert.constructor.name, 'Insert', 'object is of type Insert');
    });
  });

  describe('#update', function () {
    it('should get an Update object instance', function () {
      let api = new Api('app');
      let update = api.update('col');
      assert.equal(update.constructor.name, 'Update', 'object is of type Update');
    });
  });

  describe('#delete', function () {
    it('should get a Delete object instance', function () {
      let api = new Api('app');
      let del = api.delete('col');
      assert.equal(del.constructor.name, 'Delete', 'object is of type Delete');
    });
  });
});