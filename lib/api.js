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
    const url = `${this.url}v1/api/${this.appId}/services/${service}/${endpoint}`;
    const options = Object.assign({}, this.options, {
      method: "POST",
      body: JSON.stringify({ timeout: timeout, params: params })
    });
    return fetchAsync(url, options);
  }

  /**
   * Queues an event
   * @param {string} type - The type of event
   * @param {string} payload - Event payload
   * @returns {Promise} Returns a promise
   * @example
   * const res = await api.queueEvent("event-type", {"foo": "bar"})
   *  .delay(0)
   *  .date(new Date("2025-06-25"))
   *  .options({})
   *  .apply()
   */
  queueEvent(type, payload) {
    return new QueueEvent(this.appId, this.url, this.options, type, payload)
  }

  /**
   * Returns a FileStore client instance
   * @returns {external:FileStore} FileStore client instance
   */
  FileStore() {
    return new FileStore(this.appId, this.url, this.options);
  }
}

/**
 * Class representing the Queue Event Interface.
 * @example 
 * import { API, cond, or, and } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:4122');
 * const res = await api.queueEvent("event-type", {"foo": "bar"})
 *  .delay(0)
 *  .date(new Date("2025-06-25"))
 *  .options({})
 *  .apply()
 */
class QueueEvent {
  /**
   * Create an instance of the DB Get Interface.
   * @param {string} appId
   * @param {string} url
   * @param {Object} options
   * @param {string} eventType 
   * @param {Object} eventPayload
   */
  constructor(appId, url, options, eventType, eventPayload) {
    this.appId = appId;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = {
      type: eventType,
      delay: 0,
      payload: eventPayload,
      options: {},
      isSynchronous: false
    }
  }

  /**
   * Queues the event synchronously
   */
  synchronous() {
    this.params.isSynchronous = true;
    return this;
  }

  /**
   * Extra options object that will be sent to the event trigger webhook
   * @param {Object} options - The options object.
   */
  options(options) {
    this.params.options = options;
    return this;
  }

  /**
   * Seconds to delay the webhook trigger by
   * @param {Number} delay - delay in seconds.
   */
  delay(delay) {
    this.params.delay = delay;
    return this;
  }

  /**
   * Date to schedule the event for
   * @param {Object} date - Date object.
   */
  date(date) {
    this.params.timestamp = date;
    return this;
  }

  /**
   * Makes the query to queue the event. In case of synchronous events it will resolve to the response object from the webhook.
   * @returns {Promise} Returns a promise containing response from server.
   */
  apply() {
    if (!this.params.timestamp) {
      this.params.timestamp = new Date()
    }

    this.options.body = JSON.stringify(this.params);
    const url = `${this.url}/v1/api/${this.appId}/eventing/queue`
    return fetchAsync(url, this.options);
  }
}

module.exports = Api;
