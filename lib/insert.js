const utils = require('./utils'),
  fetchAsync = utils.fetchAsync,
  createURL = utils.createURL;
  
class Insert {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = {};
  }

  one(doc) {
    this.params.doc = doc;
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = createURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);    
  }

  many(docs) {
    this.params.doc = docs;
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = createURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);    
  }
}

module.exports = Insert;