const Batch = require('./batch');
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
 * Class representing the DB Client Interface.
 * @example 
 * import { API } from 'space-api';
 * 
 * const api = new API('my-project', 'http://localhost:4122');
 * const db = api.Mongo();
 */
class DB {
  /**
   * Create an instance of the DB Client Interface. 
   * @param {string} appId 
   * @param {string} url 
   * @param {Object} options
   * @param {string} db
   * @param {Object} realTime 
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
   * Returns a DB Get Object
   * @param {string} collection - The collection to query documents.
   * @returns {Get} DB Get Object
   */
  get(collection) {
    return new Get(this.appId, collection, this.url, this.options, this.db, 'all');
  }

  /**
   * Returns a DB Get Object to get one particular object
   * @param {string} collection - The collection to query documents.
   * @returns {Get} DB Get Object
   */  
  getOne(collection) {
    return new Get(this.appId, collection, this.url, this.options, this.db, 'one');
  }

  count(collection) {
    return new Get(this.appId, collection, this.url, this.options, this.db, 'count');
  }

  distinct(collection) {
    return new Get(this.appId, collection, this.url, this.options, this.db, 'distinct');
  }

  /**
   * Returns a DB Insert Object
   * @param {string} collection - The collection to insert documents.
   * @returns {Insert} DB Insert Object
   */
  insert(collection) {
    return new Insert(this.appId, collection, this.url, this.options, this.db);
  }

  /**
   * Returns a DB Update Object to update all matching documents
   * @param {string} collection - The collection to update documents.
   * @returns {Update} DB Update Object
   */
  update(collection) {
    return new Update(this.appId, collection, this.url, this.options, this.db, 'all');
  }

  /**
   * Returns a DB Update Object to update a particular document
   * @param {string} collection - The collection to update document.
   * @returns {Update} DB Update Object
   */  
  updateOne(collection) {
    return new Update(this.appId, collection, this.url, this.options, this.db, 'one');
  }


  /**
   * Returns a DB Update Object to upsert a particular document
   * @param {string} collection - The collection to update document.
   * @returns {Update} DB Update Object
   */  
  upsert(collection) {
    return new Update(this.appId, collection, this.url, this.options, this.db, 'upsert');
  }

  /**
   * Returns a DB Delete Object
   * @param {string} collection - The collection to delete documents in.
   * @returns {Delete} DB Insert Object
   */
  delete(collection) {
    return new Delete(this.appId, collection, this.url, this.options, this.db, 'all');
  }

  /**
   * Returns a DB Delete Object to delete a particular document
   * @param {string} collection - The collection to delete document.
   * @returns {Delete} DB Delete Object
   */    
  deleteOne(collection) {
    return new Delete(this.appId, collection, this.url, this.options, this.db, 'one');
  }

  /**
   * Returns a DB Aggregate Object
   * @param {string} collection - The collection to aggregate documents in.
   * @returns {Delete} DB Insert Object
   */
  aggr(collection) {
    return new Aggregate(this.appId, collection, this.url, this.options, this.db, 'all');
  }

  aggrOne(collection) {
    return new Aggregate(this.appId, collection, this.url, this.options, this.db, 'one');
  }

  /**
   * Returns a LiveQuery Object
   * @param {string} collection - The collection to query documents.
   * @returns {external:LiveQuery} LiveQuery Object
   * @example
   * const onSnapshot = (snapshot, type, changedDoc) => {
   *    console.log(type, snapshot, changedDoc)
   * }
   *
   * const onError = (err) => {
   *   console.log('Operation failed:', err)
   * }
   *
   * let subscription = db.liveQuery('posts').where({}).subscribe(onSnapshot, onError) 
   *
   * // Unsubscribe to clean up
   * subscription.unsubscribe()
   */

  liveQuery(collection) {
    return this.realtime.liveQuery(this.db, collection)
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
    let url = dbURL(this.url, this.db, this.appId, 'auth', `profile/${id}`);
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
    let url = dbURL(this.url, this.db, this.appId, 'auth', `edit_profile/${id}`);
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
    let url = dbURL(this.url, this.db, this.appId, 'auth', 'profiles');
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
    let url = dbURL(this.url, this.db, this.appId, 'auth', 'email/signin');
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
    let url = dbURL(this.url, this.db, this.appId, 'auth', 'email/signup');
    let body = JSON.stringify({ email, pass, name, role });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }
}

const generateFind = (condition) => {
  switch (condition.type) {
    case 'and':
      let d = {}
      condition.clauses.forEach(clause => {
        let generated = generateFind(clause)
        if (clause.type == 'cond') {
          if (d[clause.f1] == undefined) {
            d = Object.assign(d, generated)
          }
          else {
            d[clause.f1] = Object.assign(d[clause.f1], generated[clause.f1])
          }
        }
        else {
          d = Object.assign(d, generated)
        }
      });
      return d

    case 'or':
      var newConds = condition.clauses.map(cond => generateFind(cond))
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
        case 'regex':
          return {
            [condition.f1]: { $regex: condition.f2 }
          };  
      }

  }
}

const dbURL = (prefix, db, appId, moduleName, suffix) => {
  return `${prefix}v1/api/${appId}/${moduleName}/${db}/${suffix}`;
};

exports.dbURL = dbURL
exports.generateFind = generateFind
exports.DB = DB
