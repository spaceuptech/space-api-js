const db = require('./db')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the DB Delete Interface.
 * @example 
 * import { API, cond, or, and } from 'space-api';
 * 
 * const api = new API('my-project', 'localhost:4122');
 * const db = api.DB("mongo");
 * 
 * db.delete('posts').where(and(cond('title', '==', 'Title1'))).all().then(res => {
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
   * Create an instance of the DB Delete Interface.
   * @param {string} appId 
   * @param {string} collection 
   * @param {string} url 
   * @param {Object} options 
   * @param {string} db 
   * @param {string} op 
   */
  constructor(appId, collection, url, options, db, op) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = { find: {} };
    this.params.op = op;
    this.type = 'delete';
  }

  /**
   * Prepares the find query
   * @param {...Object} conditions - The condition logic.
   */
  where(...conditions) {
    this.params.find = db.generateFind(and(...conditions));
    return this;
  }

  /**
   * Makes the query to delete a single document which matches first. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.delete('posts').one().then(res => ...)
   * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
   */
  one() {
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/delete`);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to delete all the documents which match. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.delete('posts').all().then(res => ...)
   * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
   */
  all() {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/delete`);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to delete all the documents which match. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.delete('posts').apply().then(res => ...)
   */
  apply() {
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/delete`);
    return fetchAsync(url, this.options);
  }

}

module.exports = Delete;