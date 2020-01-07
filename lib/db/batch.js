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

  /**
   * Adds a request to the batch. 
   * @param {Object} req - The request to batch.
   */
  add(req) {
    this.params.reqs.push(Object.assign({}, req.params, { col: req.collection, type: req.type }))
    return this;
  }

  /**
   * Executes the batch operations. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * const batch = db.beginBatch()
   * batch.add(db.insert("todos").doc({_id: "1", todo: "Star Space Cloud"}))
   * batch.add(db.insert("todos").doc({_id: "2", todo: "Fork Space Cloud"}))
   * batch.apply().then(res => console.log("Response", res))
   */
  apply() {
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', 'batch');
    return fetchAsync(url, this.options);
  }
}

module.exports = Batch;
