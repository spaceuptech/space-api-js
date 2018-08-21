const sql = require('./sql');
const generateFind = require('../mongo/mongo').generateFind
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the SQL Update Interface.
 * @example 
 * const { API, cond, or, and } = require('space-api-node');
 * 
 * const api = new API('my-project');
 * 
 * // For MySQL Database
 * const db = api.MySQL();
 * 
 * // For PostgresQL Database
 * const db = api.Postgres();
 * 
 * db.update('posts').where(and(cond('title', '==', 'Title1'))).all({ title: 'Title2' }).then(res => {
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
    this.options = Object.assign({}, options, { method: 'PUT' });
    this.table = table;
    this.params = {};
  }

  /**
   * Prepares the find query
   * @param {...Object} conditions - The condition logic.
   */
  where(conditions) {
    this.params.find = generateFind(conditions);
    this.params.type = conditions.type
    return this;
  }

  /**
   * Makes the query to update all records which matches.
   * @param {Object} - Object containing fields and values to set.
   * @returns {Promise} Returns a promise containing response from server.
   */
  all(record) {
    this.params.record = record
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options);
  }
}

module.exports = Update;