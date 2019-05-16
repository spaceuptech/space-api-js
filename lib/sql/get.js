const sql = require('./sql');
const generateFind = require('../mongo/mongo').generateFind
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the SQL Get Interface.
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
  constructor(appId, table, url, options, db, op) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.table = table;
    this.params = { find: {}, options: {} };
    this.params.op = op;
    this.type = 'read';
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
   * Sets the fields to be selected
   * @param {Object} select - The select object.
   * @example
   * // Given query will only select author and title fields
   * const select = { author: 1, title: 1 }
   * db.get('posts').select(select).all().then(res => ...)
   */
  select(select) {
    this.params.options.select = select
    return this;
  }

  /**
   * Sets the fields to sort result by.
   * @param {...string} array - The fields to sort result by.
   * @example
   * // Given query will sort results first by age (asc) then by age (desc)
   * db.get('posts').sort('title', '-age').all().then(res => ...)
   */
  sort(...array) {
    this.params.options.sort = array.reduce((prev, curr) => {
      return curr.startsWith("-") ? Object.assign(prev, { [curr.slice(1)]: -1 }) : Object.assign(prev, { [curr]: 1 })
    }, {});
    return this;
  }

  /**
   * Sets the number of records to skip in the array. 
   * @param {number} offset - The number of records to skip.
   * @example
   * // Given query will skip the first 10 records
   * db.get('posts').skip(10).all().then(res => ...)
   */
  skip(offset) {
    this.params.options.skip = offset;
    return this;
  }

  /**
   * Sets the limit on number of records returned by the query. 
   * @param {number} num - The limit on number of records.
   * @example
   * // Given query will limit the result to 10 records
   * db.get('posts').limit(10).all().then(res => ...)
   */
  limit(limit) {
    this.params.options.limit = limit;
    return this;
  }

  /**
  * Makes the query to return a single record as an object. If no record are returned, the status code is 400. 
  * @returns {Promise} Returns a promise containing response from server.
  * @example
  * db.get('posts').one().then(res => ...)
  * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
  */
  one() {
    this.params.op = 'one';

    // Set a default limit if offset is specified and limit is not specified.
    if (this.params.options.skip !== undefined && this.params.options.limit === undefined) {
      this.params.options.limit = 1;
    }

    this.options.body = JSON.stringify(this.params);
    let url = sql.sqlURL(this.url, this.db, this.appId, 'crud', `${this.table}/read`);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return a multiple records as an array. It is possible for an empty array to be returned. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.get('posts').all().then(res => ...)
   * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
   */
  all() {
    this.params.op = 'all';

    // Set a default limit if offset is specified and limit is not specified.
    if (this.params.options.skip !== undefined && this.params.options.limit === undefined) {
      this.params.options.limit = 20;
    }

    this.options.body = JSON.stringify(this.params);
    let url = sql.sqlURL(this.url, this.db, this.appId, 'crud', `${this.table}/read`);
    return fetchAsync(url, this.options);
  }

  apply(){

    if(op === 'one'){
      // Set a default limit if offset is specified and limit is not specified.
      if (this.params.options.skip !== undefined && this.params.options.limit === undefined) {
        this.params.options.limit = 1;
      }
    } else if( op === 'all'){
      // Set a default limit if offset is specified and limit is not specified.
      if (this.params.options.skip !== undefined && this.params.options.limit === undefined) {
        this.params.options.limit = 20;
      }
    }
    this.options.body = JSON.stringify(this.params);
    let url = sql.sqlURL(this.url, this.db, this.appId, 'crud', `${this.table}/read`);
    return fetchAsync(url, this.options);
  } 
}

module.exports = Get;