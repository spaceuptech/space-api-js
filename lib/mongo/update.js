const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

/**
 * Class representing the MongoDB Update Interface.
 * @example 
 * import { API, cond, or, and } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:4122');
 * const db = api.Mongo();
 * 
 * db.update('posts').where(and(cond('title', '==', 'Title1'))).set({ title: 'Title2' }).all().then(res => {
 *   if (res.status === 200) {
 *     // The documents were updated successfully
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
   * @param {string} collection 
   * @param {string} url 
   * @param {Object} options
   */
  constructor(appId, collection, url, options, op) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = { find: {}, update: { } };
    this.params.op = op;
    this.type = 'update';

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
   * Adds an item to an array.
   * @param {Object} obj - The Object containing fields to set.
   * @example
   * db.update('posts').push({ author: 'Drake' }).all().then(res => ...)
   */
  push(obj) {
    this.params.update.$push = obj;
    return this;
  }

  /**
   * Removes the specified field from a document.
   * @param {...string} fields - The fields to remove.
   * @example
   * db.update('posts').remove('age', 'likes').all().then(res => ...)
   */
  remove(...fields) {
    this.params.update.$unset = fields.reduce((prev, curr) => Object.assign(prev, { [curr]: '' }), {});
    return this;
  }

  /**
   * Renames the specified field.
   * @param {Object} obj - The object containing fields to rename.
   * @example
   * db.update('posts').rename({ mobile: 'contact' }).all().then(res => ...)
   */
  rename(obj) {
    this.params.update.$rename = obj;
    return this;
  }

  /**
   * Increments the value of the field by the specified amount.
   * @param {Object} obj - The object containing fields to increment along with the value.
   * @example
   * // The value of added with 1
   * db.update('posts').inc({ views: 1 }).all().then(res => ...)
   */
  inc(obj) {
    this.params.update.$inc = obj;
    return this;
  }

  /**
   * Multiplies the value of the field by the specified amount.
   * @param {Object} obj - The object containing fields to multiply along with the value.
   * @example
   * // The value of amount will be multiplied by 4
   * db.update('posts').mul({ amount: 4 }).all().then(res => ...)
   */
  mul(obj) {
    this.params.update.$mul = obj;
    return this;
  }

  /**
   * Only updates the field if the specified value is greater than the existing field value.
   * @param {Object} obj - The object containing fields to set.
   * @example
   * db.update('posts').max({ highScore: 1200 }).all().then(res => ...)
   */
  max(obj) {
    this.params.update.$max = obj;
    return this;
  }

  /**
   * Only updates the field if the specified value is lesser than the existing field value.
   * @param {Object} obj - The object containing fields to set.
   * @example
   * db.update('posts').min({ lowestScore: 300 }).all().then(res => ...)
   */
  min(obj) {
    this.params.update.$min = obj;
    return this;
  }

  /**
   * Sets the value of a field to current timestamp.
   * @param {...string} values - The fields to set.
   * @example
   * db.update('posts').currentTimestamp('lastModified').all().then(res => ...)
   */
  currentTimestamp(...values) {
    this.params.update.$currentDate = Object.assign({}, this.params.update.$currentDate, values.reduce((prev, curr) => {
      return Object.assign(prev, { [curr]: { $type: 'timestamp' } });
    }, {}));
    return this;
  }

  /**
   * Sets the value of a field to current date.
   * @param {...string} values - The fields to set.
   * @example
   * db.update('posts').currentDate('lastModified').all().then(res => ...)
   */
  currentDate(...values) {
    this.params.update.$currentDate = Object.assign({}, this.params.update.$currentDate, values.reduce((prev, curr) => {
      return Object.assign(prev, { [curr]: { $type: 'date' } });
    }, {}));
    return this;
  }

  /**
  * Makes the query to update a single document which matches first.
  * @returns {Promise} Returns a promise containing response from server
  * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
  */
  one() {
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, 'crud', `${this.collection}/update`);
    return fetchAsync(url, this.options);
  }

  /**
  * Makes the query to update all documents which matches.
  * @returns {Promise} Returns a promise containing response from server
  * @deprecated Since version 0.4.3. Will be deleted in version 1.0.0. Use apply instead.
  */
  all() {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, 'crud', `${this.collection}/update`);
    return fetchAsync(url, this.options);
  }

  apply(){
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, 'crud', `${this.collection}/update`);
    return fetchAsync(url, this.options);
  }

  /**
  * Makes the query to update all, else insert a document.
  */
 upsert() {
  this.params.op = 'upsert';
  this.options.body = JSON.stringify(this.params);
  let url = mongo.mongoURL(this.url, this.appId, 'crud', `${this.collection}/update`);
  return fetchAsync(url, this.options);
}

}

module.exports = Update;
