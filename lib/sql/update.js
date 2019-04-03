const sql = require('./sql');
const generateFind = require('../mongo/mongo').generateFind
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the SQL Update Interface.
 * @example 
 * import { API, cond, or, and } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:8080');
 * 
 * // For MySQL Database
 * const db = api.MySQL();
 * 
 * // For PostgresQL Database
 * const db = api.Postgres();
 * 
 * db.update('posts').where(and(cond('title', '==', 'Title1'))).set({ title: 'Title2' }).all().then(res => {
 *   if (res.status === 200) {
 *     // The records were updated successfully
 *     return;
 *   }
 * }).catch(ex => {
 *   // Exception occured while processing request
 * });
 */
class Update {
  /**
   * Create an instance of the MongoDB Update Interface.
   * @param {string} appId 
   * @param {string} table 
   * @param {string} url 
   * @param {Object} options
   * @param {string} db 
   */
  constructor(appId, table, url, options, db) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.table = table;
    this.params = { find: {}, update: {} };
  }

  /**
   * Prepares the find query
   * @param {...Object} conditions - The condition logic.
   */
  where(...conditions) {
    this.params.find = generateFind(and(...conditions));
    return this;
  }

  /**
  * Sets the value of a field in a document.
  * @param {Object} obj - The Object containing fields to set.
  * @example
  * db.update('posts').set({ author: 'Drake' }).all().then(res => ...)
  */
  set(obj) {
    this.params.update.$set = obj;
    return this;
  }

  /**
 * Makes the query to update all records which matches.
 * @returns {Promise} Returns a promise containing response from server
 */
  all() {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = sql.sqlURL(this.url, this.db, this.appId, 'crud', `${this.table}/update`);
    return fetchAsync(url, this.options);
  }
}

module.exports = Update;