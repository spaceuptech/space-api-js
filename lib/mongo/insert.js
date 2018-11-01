const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync;

/**
 * Class representing the MongoDB Insert Interface.
 * @example 
 * const { API, cond, or, and } = require('space-api-node')
 * 
 * const api = new API('my-project');
 * const db = api.Mongo();
 * 
 * const doc = { author: 'John', title: 'Title1', _id: 1 };
 * db.insert('posts').one(doc).then(res => {
 *   if (res.status === 200) {
 *     // Document was inserted successfully
 *     return;
 *   }
 * }).catch(ex => {
 *   // Exception occured while processing request
 * });
 */
class Insert {

  /**
   * Create an instance of the MongoDB Insert Interface.
   * @param {string} appId 
   * @param {string} collection 
   * @param {string} url 
   * @param {Object} options 
   */
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = {};
  }

  /**
   * Makes the query to insert a single document. 
   * @param {Object} doc - The document to be inserted.
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * const doc = { author: 'John', title: 'Title1', _id: 1 };
   * db.insert('posts').one(doc).then(res => ...)
   */
  one(doc) {
    this.params.doc = doc;
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to insert multiple documents. 
   * @param {Object[]} docs - The documents to be inserted.
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * const docs = [{ author: 'John', title: 'Title1', _id: 1 }];
   * db.insert('posts').all(docs).then(res => ...)
   */
  all(docs) {
    this.params.doc = docs;
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }
}

module.exports = Insert;