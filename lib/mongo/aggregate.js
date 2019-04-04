const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the MongoDB Delete Interface.
 * @example 
 * import { API, cond, or, and } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:8080');
 * const db = api.Mongo();
 * 
 * const pipe = [
 *   { $match: { status: 'A' } },
 *   { $group: { _id: '$cust_id', total: { $sum: '$amount' } } }
 * ]
 * 
 * db.aggr('posts').pipe(pipe).all().then(res => {
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
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = {};
    this.params.op = 'all';
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
    let url = mongo.mongoURL(this.url, this.appId, 'crud', `${this.collection}/aggr`);
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
    let url = mongo.mongoURL(this.url, this.appId, 'crud', `${this.collection}/aggr`);
    return fetchAsync(url, this.options);
  }

  apply(){
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, 'crud', `${this.collection}/aggr`);
    return fetchAsync(url, this.options);
  }

  op(op){
    this.params.op = op;
    return this;
  }
}

module.exports = Aggregate;