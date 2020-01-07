const DB = require("./db/db").DB;
const Client = require("./websocket/websocket-client");
const Realtime = require("./realtime/realtime");
const FileStore = require("./filestore/filestore");
const fetchAsync = require("./utils").fetchAsync;

/**
 * The DB Client Interface.
 * @external DB
 * @see {@link https://github.com/spaceuptech/space-api-js/wiki/DB}
 */

 /**
 * The Realtime Client Interface.
 * @external Realtime
 * @see {@link https://github.com/spaceuptech/space-api-js/wiki/Realtime}
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
   * Returns a Mongo DB client instance
   * @returns {external:DB} DB client instance
   * @deprecated since version v0.15.0. Will be deleted in version 1.0.0. Use DB instead.
   */
  Mongo() {
    return new DB(this.appId, this.url, this.options, "mongo", this.realTime);
  }

  /**
   * Returns a Postgres DB client instance
   * @returns {external:DB} DB client instance
   * @deprecated since version v0.15.0. Will be deleted in version 1.0.0. Use DB instead.
   */
  Postgres() {
    return new DB(this.appId, this.url, this.options, "sql-postgres", this.realTime);
  }

  /**
   * Returns a MySQL Db client instance
   * @returns {external:DB} Db client instance
   * @deprecated since version v0.15.0. Will be deleted in version 1.0.0. Use DB instead.
   */
  MySQL() {
    return new DB(this.appId, this.url, this.options, "sql-mysql", this.realTime);
  }

  /**
   * Returns a DB client instance
   * @param {string} db - The alias name of the database
   * @returns {external:DB} DB client instance
   */
  DB(db) {
    return new DB(this.appId, this.url, this.options, db, this.realTime);
  }

  /**
   * Calls an endpoint from the remote service
   * @param {string} service - The name of service
   * @param {string} endpoint - The name of endpoint to be called
   * @param {Object} params - The params to be sent to the remote service
   * @param {string} [timeout = 5000] - Timeout in milliseconds
   * @returns {Promise} Returns a promise
   * @example
   * api.call('my_service', 'my_endpoint', { msg: 'Remote services are awesome!' }, 1000)
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
}

module.exports = Api;
