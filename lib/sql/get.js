const sql = require('./sql');
const generateFind = require('../mongo/mongo').generateFind
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the SQL Get Interface.
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
 * db.get('posts').where(and(cond('title', '==', 'Title1'))).all().then(res => {
 *   if (res.status === 200) {
 *     // res.data contains the records returned by the database
 *     console.log('Response:', res.data);
 *     return;
 *   }
 * }).catch(ex => {
 *   // Exception occured while processing request
 * });
 */
class Get {

  /**
   * Create an instance of the SQL Get Interface.
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
    this.options = Object.assign({}, options, { method: 'GET' });
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
   * Sets the fields to be selected
   * @param {Object} select - The select object.
   * @example
   * // Given query will only select author and title fields
   * const select = { author: 1, title: 1 }
   * db.get('posts').select(select).all().then(res => ...)
   */
  select(select) {
    this.params.select = select
  }
  
  /**
   * Sets the fields to order result by.
   * @param {...string} array - The fields to order result by.
   * @example
   * // Given query will order results first by age (asc) then by age (desc)
   * db.get('posts').order('title', '-age').all().then(res => ...)
   */
  order(...array) {
    this.params.order = array;
  }

  /**
   * Sets the number of records to skip in the array. 
   * @param {number} offset - The number of records to skip.
   * @example
   * // Given query will skip the first 10 records
   * db.get('posts').offset(10).all().then(res => ...)
   */
  offset(offset) {
    this.params.offset = offset;
  }

  /**
   * Sets the limit on number of records returned by the query. 
   * @param {number} num - The limit on number of records.
   * @example
   * // Given query will limit the result to 10 records
   * db.get('posts').limit(10).all().then(res => ...)
   */
  limit(limit) {
    this.params.limit = limit
  }

   /**
   * Makes the query to return a single record as an object. If no record are returned, the status code is 400. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.get('posts').one().then(res => ...)
   */
  one() {
    this.params.op = 'one';
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table, this.params);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return a multiple records as an array. It is possible for an empty array to be returned. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.get('posts').all().then(res => ...)
   */
  all() {
    this.params.op = 'all';
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table, this.params);
    return fetchAsync(url, this.options);
  }
}

module.exports = Get;