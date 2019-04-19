const Get = require('./get');
const Insert = require('./insert');
const Update = require('./update');
const Delete = require('./delete');
const Aggregate = require('./aggregate');
const myURL = require('url')
if (typeof window === 'undefined') {
  global.URL = myURL.URL;
}

const fetchAsync = require('../utils').fetchAsync;

/**
 * The LiveQuery Interface.
 * @external LiveQuery
 * @see {@link https://github.com/spaceuptech/space-api-js/wiki/Realtime}
 */

/**
 * @typedef User
 * @property {string} _id - The user's unique id.
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
 * Class representing the MongoDB Client Interface.
 * @example 
 * import { API } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:8080');
 * const db = api.Mongo();
 */
class Mongo {
  /**
   * Create an instance of the MongoDB Client Interface. 
   * @param {string} appId 
   * @param {string} url 
   * @param {Object} options
   * @param {Object} realTime 
   */
  constructor(appId, url, options, realtime) {
    this.appId = appId
    this.url = url
    this.options = options
    this.realtime = realtime
  }

  /**
   * Returns a MongoDB Get Object
   * @param {string} collection - The collection to query documents.
   * @returns {Get} MongoDB Get Object
   */
  get(collection) {
    return new Get(this.appId, collection, this.url, this.options,'all');
  }

  getOne(collection){
    return new Get(this.appId, collection, this.url, this.options, 'one');
  }

  count(collection){
    return new Get(this.appId, collection, this.url, this.options, 'count');
  }

  distinct(collection){
    return new Get(this.appId, collection, this.url, this.options, 'distinct');
  }

  /**
   * Returns a MongoDb Insert Object
   * @param {string} collection - The collection to insert documents.
   * @returns {Insert} MongoDB Insert Object
   */
  insert(collection) {
    return new Insert(this.appId, collection, this.url, this.options);
  }

  /**
   * Returns a MongoDb Update Object
   * @param {string} collection - The collection to update documents.
   * @returns {Update} MongoDB Update Object
   */
  update(collection) {
    return new Update(this.appId, collection, this.url, this.options, 'all');
  }

  updateOne(collection){
    return new Update(this.appId, collection, this.url, this.options, 'one');
  }

  upsert(collection){
    return new Update(this.appId, collection, this.url, this.options, 'upsert');
  }

  /**
   * Returns a MongoDb Delete Object
   * @param {string} collection - The collection to delete documents in.
   * @returns {Delete} MongoDB Insert Object
   */
  delete(collection) {
    return new Delete(this.appId, collection, this.url, this.options, 'all');
  }

  deleteOne(collection){
    return new Delete(this.appId, collection, this.url, this.options, 'one');
  }

  /**
   * Returns a MongoDb Aggregate Object
   * @param {string} collection - The collection to aggregate documents in.
   * @returns {Delete} MongoDB Insert Object
   */
  aggr(collection) {
    return new Aggregate(this.appId, collection, this.url, this.options);
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
    return this.realtime.liveQuery('mongo', collection)
  }

  /**
   * Fetches the user profile
   * @param {string} id - The unique user id
   * @returns {Promise} Returns a promise containing response from server
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
    let url = mongoURL(this.url, this.appId, 'auth', `profile/${id}`);
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
    let url = mongoURL(this.url, this.appId, 'auth', `profile/${id}`);
    return fetchAsync(url, Object.assign({}, this.options, { method: 'PUT', body: body }));
  }

  /**
   * Fetches all the user profiles
   * @returns {Promise} Returns a promise containing response from server
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
    let url = mongoURL(this.url, this.appId, 'auth', 'profiles');
    return fetchAsync(url, Object.assign({}, this.options, { method: 'GET' }));
  }
  /**
   * Sends a sign in query to the server
   * @param {string} email - The user's email id.
   * @param {string} pass - The user's password.
   * @returns {Promise<AuthResponse>} Returns a promise containing response from server
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
    let url = mongoURL(this.url, this.appId, 'auth', 'email/signin');
    let body = JSON.stringify({ email, pass });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }

  /**
   * Sends a sign up query to the server
   * @param {string} email - The user's email id.
   * @param {string} name - The user's name.
   * @param {string} pass - The user's password.
   * @param {string} role - The user's role.
   * @returns {Promise<AuthResponse>} Returns a promise containing response from server
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
    let url = mongoURL(this.url, this.appId, 'auth', 'email/signup');
    let body = JSON.stringify({ email, pass, name, role });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }
}

const generateFind = (condition) => {
  switch (condition.type) {
    case 'and':
      return condition.clauses.reduce((prev, curr) => Object.assign({}, prev, generateFind(curr)), {})

    case 'or':
      newConds = condition.clauses.map(cond => generateFind(cond))
      return { '$or': newConds }

    case 'cond':
      switch (condition.op) {
        case '==':
          return {
            [condition.f1]: condition.f2
          };
        case '>':
          return {
            [condition.f1]: { $gt: condition.f2 }
          };
        case '<':
          return {
            [condition.f1]: { $lt: condition.f2 }
          };
        case '>=':
          return {
            [condition.f1]: { $gte: condition.f2 }
          };
        case '<=':
          return {
            [condition.f1]: { $lte: condition.f2 }
          };
        case '!=':
          return {
            [condition.f1]: { $ne: condition.f2 }
          };
        case 'in':
          return {
            [condition.f1]: { $in: condition.f2 }
          };
        case 'notIn':
          return {
            [condition.f1]: { $nin: condition.f2 }
          };
      }

  }
}

const mongoURL = (prefix, appId, moduleName, suffix) => {
  let url = `${prefix}v1/api/${appId}/${moduleName}/mongo/${suffix}`;
  return new URL(url)
};

exports.mongoURL = mongoURL
exports.generateFind = generateFind
exports.Mongo = Mongo