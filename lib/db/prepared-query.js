const db = require('./db')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync;

/**
 * Class representing the Prepared Query Interface.
 * @example 
 * import { API } from 'space-api';
 * 
 * const api = new API('my-project', 'localhost:4122');
 * const db = api.DB("mongo");
 * 
 * db.preparedQuery('myPreparedQuery').args({ "foo": "bar" }).apply().then(res => {
 *   if (res.status === 200) {
 *     // The prepared query was executed successfully
 *     console.log("Data", res.data)
 *     return;
 *   }
 * }).catch(ex => {
 *   // Exception occured while processing request
 * });
 */
class PreparedQuery {
  /**
   * Create an instance of the Prepared Query Interface.
   * @param {string} appId 
   * @param {string} id 
   * @param {string} url 
   * @param {Object} options 
   * @param {string} db 
   */
  constructor(appId, id, url, options, db) {
    this.appId = appId;
    this.id = id;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = { params: {} };
  }

  /**
   * Prepares the args object
   * @param {Object} args - The args object.
   */
  args(argsObject) {
    this.params.params = argsObject;
    return this;
  }

  /**
   * Executes the prepared query. 
   * @returns {Promise} Returns a promise containing response from server.
   * @example
   * db.preparedQuery('myPreparedQuery').args({ "foo": "bar" }).apply().then(res => ...)
   */
  apply() {
    this.options.body = JSON.stringify(this.params);
    let url = db.dbURL(this.url, this.db, this.appId, 'crud', `prepared-queries/${this.id}`);
    return fetchAsync(url, this.options);
  }
}

module.exports = PreparedQuery;