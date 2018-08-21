const Mongo = require('./mongo/mongo').Mongo;
const SQL = require('./sql/sql').SQL;
const Client = require('./websocket/websocket-client')
const Realtime = require('./realtime/realtime')

/**
 * The MongoDB Client Interface.
 * @external Mongo
 * @see {@link https://github.com/spaceuptech/space-api-node/wiki/Mongo}
 */

/**
 * The SQL Client Interface.
 * @external SQL
 * @see {@link https://github.com/spaceuptech/space-api-node/wiki/SQL}
 */

/**
 * Class representing the client api.
 * @example 
 * import { API } from 'space-api-node';
 * 
 * const api = new API('my-project');
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
}

module.exports = Api;