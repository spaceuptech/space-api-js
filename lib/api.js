const DB = require("./db/db").DB;
const Client = require("./websocket/websocket-client");
const Realtime = require("./realtime/realtime");
const FileStore = require("./filestore/filestore");
const Pubsub = require("./pubsub/pubsub");
const fetchAsync = require("./utils").fetchAsync;

/**
 * The DB Client Interface.
 * @external DB
 * @see {@link https://github.com/spaceuptech/space-api-js/wiki/DB}
 */

/**
* The FileStore Client Interface.
* @external FileStore
* @see {@link https://github.com/spaceuptech/space-api-js/wiki/FileStore}
*/

/**
 * Class representing the client api.
 * @example
 * import { API } from 'space-api';
 *
 * const api = new API('my-project', 'http://localhost:4122');
 */
class Api {
  /**
   * Create an instance of the Client API.
   * @param {string} projectId - The Project Id.
   * @param {string} url - Base url of space-cloud server.
   */
  constructor(projectId, url = "/") {
    if (!url.endsWith("/")) {
      url = url + "/";
    }
    this.appId = projectId;
    this.url = url;
    this.options = {
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    };
    this.webSocketOptions = { projectId: projectId };
    this.serviceOptions = { project: projectId };
    let client = new Client(url, this.webSocketOptions);
    this.client = client;
    this.realTime = new Realtime(projectId, client);
    this.pubsub = new Pubsub(url, projectId, client);
  }

  /**
   * Initialse the Client Api with the JWT token
   * @param {string} token - The signed JWT token received from the server on successful authentication.
   */
  setToken(token) {
    this.serviceOptions.token = token;
    this.webSocketOptions.token = token;
    this.options.headers.Authorization = "Bearer " + token;
  }

  /**
   * Set the new Project Id
   * @param {string} projectId - The Project Id.
   */
  setProjectId(projectId) {
    this.appId = projectId;
    this.serviceOptions.project = projectId;
  }

  /**
   * Returns a DB client instance
   * @returns {external:DB} DB client instance
   */
  Mongo() {
    return new DB(this.appId, this.url, this.options, "mongo", this.realTime);
  }

  /**
   * Returns a DB client instance
   * @returns {external:DB} DB client instance
   */
  Postgres() {
    return new DB(this.appId, this.url, this.options, "sql-postgres", this.realTime);
  }

  /**
   * Returns a Db client instance
   * @returns {external:Db} Db client instance
   */
  MySQL() {
    return new DB(this.appId, this.url, this.options, "sql-mysql", this.realTime);
  }

  DB(db) {
    return new DB(this.appId, this.url, this.options, db, this.realTime);
  }

  /**
   * Calls a function from Function as a Service Engine
   * @param {string} engineName - The name of engine with which the function is registered
   * @param {string} funcName - The name of function to be called
   * @param {Object} params - The params for the function
   * @param {string} [timeout = 5000] - Timeout in milliseconds
   * @returns {Promise} Returns a promise
   * @example
   * api.call('my-engine', 'my-func', { msg: 'Function as a Service is awesome!' }, 1000)
   * .then(res => {
   *   if (res.status === 200) {
   *     // res.data contains the response given by the function
   *     console.log('Response:', res.data);
   *     return;
   *   }
   * }).catch(ex => {
   *   // Exception occured while processing request
   * });
   */

  call(service, endpoint, params, timeout) {
    if (timeout === undefined) timeout = 5000;
    const url = `${this.url}v1/api/${this.appId}/functions/${service}/${endpoint}`;
    const options = Object.assign({}, this.options, {
      method: "POST",
      body: JSON.stringify({ timeout: timeout, params: params })
    });
    return fetchAsync(url, options);
  }

  /**
   * Returns a FileStore client instance
   * @returns {external:FileStore} FileStore client instance
   */
  FileStore() {
    return new FileStore(this.appId, this.url, this.options);
  }

  /**
   * Returns a Pubsub client instance
   * @returns {external:Pubsub} Pubsub client instance
   */
  Pubsub() {
    return this.pubsub;
  }
}

module.exports = Api;
