const Mongo = require('./mongo/mongo').Mongo;
const SQL = require('./sql/sql').SQL;

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
 * const api = new API('my-project');
 */
class Api {
  /**
   * Create an instance of the Client API.
   * @param {string} projectId - The Project Id.
   * @param {string} url - Base url of space-exec server.
   */
  constructor(projectId, url = '/') {
    this.appId = projectId;
    this.url = url;
    this.options = {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    };
  }

  /**
   * Initialse the Client Api with the JWT token
   * @param {string} token - The signed JWT token received from the server on successful authentication.
   */
  setToken(token) {
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
    return new Mongo(this.appId, this.url, this.options);
  }

  /**
   * Returns a SQL client instance
   * @returns {external:SQL} SQL client instance
   */
  Postgres() {
    return new SQL(this.appId, this.url, this.options, 'postgres');
  }

  /**
   * Returns a SQL client instance
   * @returns {external:SQL} SQL client instance
   */
  MySQL() {
    return new SQL(this.appId, this.url, this.options, 'mysql');
  }
}

module.exports = Api;