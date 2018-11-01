const sql = require('./sql');
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the SQL Insert Interface.
 * @example 
 * import { API, cond, or, and } from 'space-api';
 * 
 * const api = new API('my-project');
 * 
 * // For MySQL Database
 * const db = api.MySQL();
 * 
 * // For Postgres Database
 * const db = api.Postgres();
 * 
 * const record = { author: 'John', title: 'Title1', _id: 1 };
 * db.insert('posts').one(record).then(res => {
 *   if (res.status === 200) {
 *     // Record was inserted successfully
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
    this.params = {};
  }

  /**
  * Makes the query to insert a single record. 
  * @param {Object} record - The record to be inserted.
  * @returns {Promise} Returns a promise containing response from server.
  * @example
  * const record = { author: 'John', title: 'Title1', id: 1 };
  * db.insert('posts').one(record).then(res => ...)
  */
  one(record) {
    this.params.op = 'one';
    this.params.record = record;
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options)
  }

  /**
   * Makes the query to insert multiple records. 
   * @param {Object[]} records - The records to be inserted.
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * const records = [{ author: 'John', title: 'Title1', id: 1 }];
   * db.insert('posts').all(records).then(res => ...)
   */
  all(records) {
    this.params.op = 'all';
    this.params.record = records;
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options)
  }
}

module.exports = Insert;