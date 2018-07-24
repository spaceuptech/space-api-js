const mongo = require('./mongo/mongo')

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

  Mongo() {
    return new mongo.Mongo(this.appId, this.url, this.options);
  }
}

module.exports = Api;