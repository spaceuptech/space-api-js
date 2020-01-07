const db = require('./db')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync;

/**
 * Class representing the DB Aggregate Interface.
 * @example 
 * import { API, cond, or, and } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:4122');
 * const db = api.Mongo();
 * 
 * const pipe = [
 *   { $match: { status: 'A' } },
 *   { $group: { _id: '$cust_id', total: { $sum: '$amount' } } }
 * ]
 * 
 * db.aggr('posts').pipe(pipe).apply().then(res => {
 *   if (res.status === 200) {
 *     // res.data contains the documents returned by the database
 *     console.log('Response:', res.data);
 *     return
 *   }
 * }).catch(ex => {
 *   // Exception occured while processing request
 * });
 */
class Aggregate {
  /**
   * Create an instance of the DB Aggregate Interface.
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
    this.options = Object.assign({}, options, { method: 'POST' });
    this.db = db;
    this.params = {};
    this.params.op = op;
  }

  /**
   * Prepares the Pipe query
   * @param {Object[]} pipeObj - The pipeline object.
   */
  pipe(pipeObj) {
    this.params.pipe = pipeObj;
    return this;
  }

  /**
   * Makes the query to return single object. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.aggr('posts').pipe([...]).one().then(res => ...)
   * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
   */
  one() {
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/aggr`);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return all objects. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.aggr('posts').pipe([...]).all().then(res => ...)
   * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
   */
  all() {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/aggr`);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return all objects. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.aggr('posts').pipe([...]).apply().then(res => ...)
   */
  apply(){
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/aggr`);
    return fetchAsync(url, this.options);
  }
}

module.exports = Aggregate;