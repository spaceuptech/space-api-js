const Get = require('./get');
const Insert = require('./insert');
const Update = require('./update');
const Delete = require('./delete');

class Api {
  constructor(appId, url = '/') {
    this.appId = appId;
    this.url = url;
    this.options = {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    };
  }

  setToken(token) {
    this.options.headers.Authorization = 'Bearer ' + token;
  }

  setAppId(appId) {
    this.appId = appId;
  }

  get(collection) {
    return new Get(this.appId, collection, this.url, this.options);
  }

  insert(collection) {
    return new Insert(this.appId, collection, this.url, this.options);
  }

  update(collection) {
    return new Update(this.appId, collection, this.url, this.options);
  }

  delete(collection) {
    return new Delete(this.appId, collection, this.url, this.options);
  }
}

module.exports = Api;