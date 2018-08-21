const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the MongoDB Delete Interface.
 * @example 
 * const { API, cond, or, and } = require('space-api-node')
 * 
 * const api = new API('my-project');
 * const db = api.Mongo();
 * 
 * db.delete('posts').where(and(cond('title', '==', 'Title1'))).many().then(res => {
 *   if (res.status === 200) {
 *     // The documents were deleted successfully
 *     return;
 *   }
 * }).catch(ex => {
 *   // Exception occured while processing request
 * });
 */
class Delete {
  /**
   * Create an instance of the MongoDB Delete Interface.
   * @param {string} appId 
   * @param {string} collection 
   * @param {string} url 
   * @param {Object} options 
   */
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'DELETE' });
    this.params = {};
  }

  /**
   * Prepares the find query
   * @param {...Object} conditions - The condition logic.
   */
  where(...conditions) {
    this.params.find = mongo.generateFind(and(...conditions));
    return this;
  }

  /**
   * Makes the query to delete a single document which matches first. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.delete('posts').one().then(res => ...)
   */
  one() {
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to delete all the documents which match. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.delete('posts').many().then(res => ...)
   */
  many() {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }
}

module.exports = Delete;