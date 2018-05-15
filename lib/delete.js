const utils = require('./utils'),
  fetchAsync = utils.fetchAsync,
  createURL = utils.createURL,
  and = utils.and;

class Delete {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = {};
  }

  where(...conditions) {
    this.params.find = and(...conditions);
    return this;
  }

  one(doc) {
    this.params.op = 'one';
    let url = createURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }

  many(docs) {
    this.params.op = 'all';
    let url = createURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }
}

module.exports = Delete;