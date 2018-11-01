const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

  /**
   * Class representing the MongoDB Get Interface.
   * @example 
   * const { API, cond, or, and } = require('space-api-node')
   * 
   * const api = new API('my-project');
   * const db = api.Mongo();
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
   * Create an instance of the MongoDB Get Interface.
   * @param {string} appId 
   * @param {string} collection 
   * @param {string} url 
   * @param {Object} options 
   */
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'GET' });
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
   * Sets the fields to be selected
   * @param {Object} select - The select object.
   * @example
   * // Given query will only select author and title fields
   * const select = { author: 1, title: 1 }
   * db.get('posts').select(select).all().then(res => ...)
   */
  select(select) {
    this.params.select = select;
    return this;
  }

  /**
   * Sets the fields to order result by.
   * @param {...string} array - The fields to order result by.
   * @example
   * // Given query will order results first by age (asc) then by age (desc)
   * db.get('posts').sort('title', '-age').all().then(res => ...)
   */
  sort(...array) {
    this.params.sort = array;
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
    this.params.skip = num;
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
    this.params.limit = num;
    return this;
  }

  /**
   * Makes the query to return a single document as an object. If no documents are returned, the status code is 400. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.get('posts').one().then(res => ...)
   */
  one() {
    this.params.op = 'one';
    let url = mongo.mongoURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return a multiple documents as an array. It is possible for an empty array to be returned. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.get('posts').all().then(res => ...)
   */
  all() {
    this.params.op = 'all';
    let url = mongo.mongoURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }

   /**
   * Makes the query to return an array of all the distinct values for the given field. It is possible for an empty array to be returned. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.get('posts').distinct('category').then(res => ...)
   */
  distinct(key) {
    this.params.op = 'distinct';
    this.params.distinct = key;
    let url = mongo.mongoURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }

  /**
   * Makes the query to return the count of total number of documents that were queried. 
   * @example
   * // Given query counts the total number of posts in the 'posts' collection
   * db.get('posts').count().then(res => ...)
   */
  count() {
    this.params.op = 'count';
    let url = mongo.mongoURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }
}

module.exports = Get;