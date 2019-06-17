const fetchAsync = require('../utils').fetchAsync;

const Batch = require('./batch');
const Get = require('./get');
const Insert = require('./insert');
const Update = require('./update');
const Delete = require('./delete');

/**
 * The LiveQuery Interface.
 * @external LiveQuery
 * @see {@link https://github.com/spaceuptech/space-api-js/wiki/Realtime}
 */

/**
 * @typedef User
 * @property {string} id - The user's unique id.
 * @property {string} email The user's email id.
 * @property {string} name The user's name.
 * @property {string} role The user's role.
 */

/**
 * @typedef AuthResponse
 * @property {number} status - The http status code of response.
 * @property {Object} data The response payload.
 * @property {string} data.token The signed token generated for the user.
 * @property {User} data.user Information of the user.
 */

/**
 * Class representing the SQL Client Interface.
 * @example 
 * // Create table if you are using any user management module 
 * CREATE TABLE users (id VARCHAR(50), account VARCHAR(50), email VARCHAR(100), name VARCHAR(100), pass VARCHAR(50), role VARCHAR(50));
 * 
 * import { API } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:8080');
 * 
 * // For MySQL Database
 * const db = api.MySQL();
 * 
 * 
 * // For PostgreQL Database
 * const db = api.Postgres();
 */
class SQL {

  /**
   * Create an instance of the SQL Client Interface. 
   * @param {string} appId 
   * @param {string} url 
   * @param {Object} options 
   * @param {string} db
   */
  constructor(appId, url, options, db, realtime) {
    this.appId = appId
    this.url = url
    this.options = options
    this.db = db
    this.realtime = realtime
  }

  beginBatch() {
    return new Batch(this.appId, this.url, this.options, this.db);
  }

  /**
   * Returns a SQL Get Object
   * @param {string} table - The table to query records.
   * @returns {Get} SQL Get Object
   */
  get(table) {
    return new Get(this.appId, table, this.url, this.options, this.db, 'all');
  }

  getOne(table) {
    return new Get(this.appId, table, this.url, this.options, this.db, 'one');
  }

  /**
   * Returns a SQL Insert Object
   * @param {string} table - The table to insert records.
   * @returns {Insert} SQL Insert Object
   */
  insert(table) {
    return new Insert(this.appId, table, this.url, this.options, this.db);
  }

  /**
   * Returns a SQL Update Object
   * @param {string} table - The table to update records.
   * @returns {Update} SQL Update Object
   */
  update(table) {
    return new Update(this.appId, table, this.url, this.options, this.db, 'all');
  }

  /**
   * Returns a SQL Delete Object
   * @param {string} table - The table to delete records.
   * @returns {Delete} SQL Delete Object
   */
  delete(table) {
    return new Delete(this.appId, table, this.url, this.options, this.db, 'all');
  }

  /**
    * Returns a LiveQuery Object
    * @param {string} collection - The collection to query documents.
    * @returns {external:LiveQuery} LiveQuery Object
    * @example
    * const onSnapshot = (snapshot, type, docs) => {   
    *    console.log(type, snapshot, docs)
    * }
    *
    * const onError = (err) => {
    *   console.log('Operation failed:', err)
    * }
    *
    * let unsubscribe = db.liveQuery('posts').where({}).subscribe(onSnapshot, onError) 
    *
    * // Unsubscribe to clean up
    * unsubscribe()
    */

  liveQuery(collection) {
    return this.realtime.liveQuery(this.db, collection)
  }

  /**
   * Fetches the user profile
   * @param {string} id - The unique user id
   * @returns {Promise} Return a promise containing response from server
   * @example 
   * db.profile(id).then(res => {
   *   if (res.status === 200) {
   *     // res.data.user contains user details
   *     console.log('Response:', res.data.user);
   *     return;
   *   }
   *   // Request failed
   * }).catch(ex => {
   *   // Exception occured while processing request
   * });
   */
  profile(id) {
    let url = sqlURL(this.url, this.db, this.appId, 'auth', `profile/${id}`);
    return fetchAsync(url, Object.assign({}, this.options, { method: 'GET' }));
  }

  /**
   * Updates the user profile
   * @param {string} id - The unique user id
   * @param {string} email - The new email id
   * @param {string} name - The new name
   * @param {string} pass - The new password
   * @returns {Promise} Return a promise containing response from server
   * @example 
   * db.editProfile(id, email, name, pass).then(res => {
   *   if (res.status === 200) {
   *     // User account has been updates successfully
   *     return;
   *   }
   *   // Request failed
   * }).catch(ex => {
   *   // Exception occured while processing request
   * });
   */
  editProfile(id, email, name, pass) {
    const body = JSON.stringify({ update: { $set: { email, name, pass } } });
    let url = sqlURL(this.url, this.db, this.appId, 'auth', `edit_profile/${id}`);
    return fetchAsync(url, Object.assign({}, this.options, { method: 'PUT', body: body }));
  }

  /**
   * Fetches all the user profiles
   * @returns {Promise} Return a promise containing response from server
   * @example 
   * db.profiles().then(res => {
   *   if (res.status === 200) {
   *     // res.data.users contains user details
   *     console.log('Response:', res.data.users);
   *     return;
   *   }
   *   // Request failed
   * }).catch(ex => {
   *   // Exception occured while processing request
   * });
   */
  profiles() {
    let url = sqlURL(this.url, this.db, this.appId, 'auth', 'profiles');
    return fetchAsync(url, Object.assign({}, this.options, { method: 'GET' }));
  }

  /**
   * Sends a sign in query to the server
   * @param {string} email - The user's email id.
   * @param {string} pass - The user's password.
   * @returns {Promise<AuthResponse>} Return a promise containing response from server
   * @example 
   * db.signIn('demo@example.com', '1234').then(res => {
   *   if (res.status === 200) {
   *     // Set the token id to enable crud operations
   *     api.setToken(res.data.token)
   * 
   *     // res.data contains request payload
   *     console.log('Response:', res.data);
   *     return;
   *   }
   *   // Request failed
   * }).catch(ex => {
   *   // Exception occured while processing request
   * });
   */
  signIn(email, pass) {
    let url = sqlURL(this.url, this.db, this.appId, 'auth', 'email/signin');
    let body = JSON.stringify({ email, pass });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }

  /**
   * Sends a sign up query to the server
   * @param {string} email - The user's email id.
   * @param {string} name - The user's name.
   * @param {string} pass - The user's password.
   * @param {string} role - The user's role.
   * @returns {Promise<AuthResponse>} Return a promise containing response from server
   * @example 
   * db.signUp('demo@example.com', 'UserName', '1234', 'default').then(res => {
   *   if (res.status === 200) {
   *     // Set the token id to enable crud operations
   *     api.setToken(res.data.token)
   *     
   *     // res.data contains request payload
   *     console.log('Response:', res.data);
   *     return;
   *   }
   *   // Request failed
   * }).catch(ex => {
   *   // Exception occured while processing request
   * });
   */
  signUp(email, name, pass, role) {
    let url = sqlURL(this.url, this.db, this.appId, 'auth', 'email/signup');
    let body = JSON.stringify({ email, pass, name, role });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }
}

const sqlURL = (prefix, db, appId, moduleName, suffix) => {
  let url = `${prefix}v1/api/${appId}/${moduleName}/sql-${db}/${suffix}`;
  return url;
};

const generateFind = (condition) => {
  switch (condition.type) {
    case 'cond':
      if (condition.op === "==") return {
        [condition.f1]: condition.f2
      };
      return {
        [condition.f1]: { op: condition.op, val: condition.f2 }
      };
    case 'and':
      return condition.clauses.reduce((prev, curr) => Object.assign({}, prev, generateFind(curr)), {});
    case 'or':
      return condition.clauses;
  }
};

exports.generateFind = generateFind;
exports.sqlURL = sqlURL;
exports.SQL = SQL;
