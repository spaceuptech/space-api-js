const utils = require('./utils'),
  fetchAsync = utils.fetchAsync,
  createURL = utils.createURL,
  and = utils.and;

class Get {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'GET' });
    this.params = {};
  }

  where(...conditions) {
    this.params.find = and(...conditions);
    return this;
  }

  select(obj) {
    this.params.select = obj;
    return this;
  }

  sort(...array) {
    this.params.sort = array;
    return this;
  }

  skip(num) {
    this.params.skip = num;
    return this;
  }

  limit(num) {
    this.params.limit = num;
    return this;
  }

  one() {
    this.params.op = 'one';
    let url = createURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }

  all() {
    this.params.op = 'all';
    let url = createURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }

  count() {
    this.params.op = 'count';
    let url = createURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }
}

module.exports = Get;