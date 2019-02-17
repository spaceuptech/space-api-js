const Mongo = require('./mongo/mongo').Mongo;
const SQL = require('./sql/sql').SQL;
const Client = require('./websocket/websocket-client')
const Realtime = require('./realtime/realtime')
const fetchAsync = require('./utils').fetchAsync

/**
 * The MongoDB Client Interface.
 * @external Mongo
 * @see {@link https://github.com/spaceuptech/space-api-js/wiki/Mongo}
 */

/**
 * The SQL Client Interface.
 * @external SQL
 * @see {@link https://github.com/spaceuptech/space-api-js/wiki/SQL}
 */

/**
 * Class representing the client api.
 * @example 
 * import { API } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:8080');
 */
class Api {
  /**
   * Create an instance of the Client API.
   * @param {string} projectId - The Project Id.
   * @param {string} url - Base url of space-exec server.
   */
  constructor(projectId, url = '/') {
    if (!url.endsWith('/')) {
      url = url + '/'
    }
    this.appId = projectId;
    this.url = url;
    this.options = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    this.webSocketOptions = {}
    let client = new Client(url, this.webSocketOptions)
    this.client = client
    this.realTime = new Realtime(projectId, client)
  }

  /**
   * Initialse the Client Api with the JWT token
   * @param {string} token - The signed JWT token received from the server on successful authentication.
   */
  setToken(token) {
    this.webSocketOptions.token = token
    this.options.headers.Authorization = 'Bearer ' + token;
  }

  /**
   * Set the new Project Id
   * @param {string} projectId - The Project Id.
   */
  setProjectId(projectId) {
    this.appId = projectId;
  }

  /**
   * Returns a MongoDB client instance
   * @returns {external:Mongo} MongoDB client instance
   */
  Mongo() {
    return new Mongo(this.appId, this.url, this.options, this.realTime);
  }

  /**
   * Returns a SQL client instance
   * @returns {external:SQL} SQL client instance
   */
  Postgres() {
    return new SQL(this.appId, this.url, this.options, 'postgres', this.realTime);
  }

  /**
   * Returns a SQL client instance
   * @returns {external:SQL} SQL client instance
   */
  MySQL() {
    return new SQL(this.appId, this.url, this.options, 'mysql', this.realTime);
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

  call(engineName, funcName, params, timeout) {
    if (timeout === undefined) timeout = 5000
    const url = `${this.url}v1/api/faas/${engineName}/${funcName}`
    const options = Object.assign({}, this.options, { method: 'POST', body: JSON.stringify({ timeout: timeout, params: params }) })
    return fetchAsync(url, options)
  }
}


module.exports = Api;