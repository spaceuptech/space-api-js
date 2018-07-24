const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Delete {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'DELETE' });
    this.params = {};
  }

  where(...conditions) {
    this.params.find = mongo.generateFind(and(...conditions));
    return this;
  }

  one(doc) {
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }

  many(docs) {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }
}

module.exports = Delete;