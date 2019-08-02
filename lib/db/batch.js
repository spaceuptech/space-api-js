const db = require('./db')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync;

class Batch {
  constructor(appId, url, options, db) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = { reqs: [] };
  }

  add(req) {
    this.params.reqs.push(Object.assign({}, req.params, { col: req.collection, type: req.type }))
    return this;
  }

  apply() {
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', 'batch');
    return fetchAsync(url, this.options);
  }
}

module.exports = Batch;
