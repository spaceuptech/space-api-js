const db = require('./db')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

  /**
   * Class representing the DB Get Interface.
   * @example 
   * import { API, cond, or, and } from 'space-api';
   * 
   * const api = new API('my-project', 'http://localhost:4122');
   * const db = api.DB("mongo");
   * 
   * db.get('posts').where(and(cond('title', '==', 'Title1'))).all().then(res => {
   *   if (res.status === 200) {
   *     // res.data contains the documents returned by the database
   *     console.log('Response:', res.data);
   *     return;
   *   }
   * }).catch(ex => {
   *   // Exception occured while processing request
   * });
   */
class Get {
  /**
   * Create an instance of the DB Get Interface.
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
    this.params = { find: {}, options: {} };
    this.params.op = op;
    this.type = 'read';

  }

  /**
   * Prepares the find query
   * @param {...Object} conditions - The condition logic.
   */
  where(...conditions) {
    this.params.find = db.generateFind(and(...conditions));
    return this;
  }
  whereRaw(condition) {
    this.params.find = condition;
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
    this.params.options.select = select;
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
    this.params.options.sort = array
    return this;
  }

  /**
   * Sets the number of documents to skip in the array. 
   * @param {number} num - The number of documents to skip.
   * @example
   * // Given query will skip the first 10 documents
   * db.get('posts').skip(10).all().then(res => ...)
   */
  skip(num) {
    this.params.options.skip = num;
    return this;
  }

  /**
   * Sets the limit on number of documents returned by the query. 
   * @param {number} num - The limit on number of documents.
   * @example
   * // Given query will limit the result to 10 documents
   * db.get('posts').limit(10).all().then(res => ...)
   */
  limit(num) {
    this.params.options.limit = num;
    return this;
  }

  /**
   * Makes the query to return a single document as an object. If no documents are returned, the status code is 400. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.get('posts').one().then(res => ...)
   * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
   */
  one() {
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/read`);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return multiple documents as an array. It is possible for an empty array to be returned. 
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
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/read`);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return multiple documents as an array. It is possible for an empty array to be returned. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.get('posts').apply().then(res => ...)
   */
  apply(){

    // Set a default limit if offset is specified and limit is not specified.
    if (this.params.options.skip !== undefined && this.params.options.limit === undefined) {
      this.params.options.limit = 20;
    }

    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/read`);
    return fetchAsync(url, this.options);
  }

  /**
  * Makes the query to return an array of all the distinct values for the given field. It is possible for an empty array to be returned. 
  * @returns {Promise} Returns a promise containing response from server.
  * @example
  * db.get('posts').distinct('category').then(res => ...)
  * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
  */
  distinct(key) {
    this.params.op = 'distinct';
    this.params.options.distinct = key;
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/read`);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return the count of total number of documents that were queried. 
   * @example
   * // Given query counts the total number of posts in the 'posts' collection
   * db.get('posts').count().then(res => ...)
   * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
   */
  count() {
    this.params.op = 'count';
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `${this.collection}/read`);
    return fetchAsync(url, this.options);
  }
}

module.exports = Get;