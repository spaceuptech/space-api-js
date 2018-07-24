const Mongo = require('./mongo/mongo').Mongo;
const SQL = require('./sql/sql').SQL;

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
    return new Mongo(this.appId, this.url, this.options);
  }

  Postgres() {
    return new SQL(this.appId, this.url, this.options, 'postgres');
  }

  MySQL() {
    return new SQL(this.appId, this.url, this.options, 'mysql');
  }
}

module.exports = Api;