const mongo = require('../mongo/mongo')
const and = require('../utils').and
const WebSocketClient = require('../websocket/websocket-client').WebSocketClient
const generateId = require('../utils').generateId;
const snapshotCallback = require('./helper').snapshotCallback

/**
 * Class representing the LiveQuery Interface.
 * @example
 * import { API, cond, or, and } from 'space-api';
 * const api = new API('my-project');
 * 
 * // For MongoDb Database
 * const db = api.Mongo();
 * 
 * const onSnapshot  = (snapshot, type, docs) => {
 *    console.log(type, snapshot, docs)
 *  }
 *
 *  const onError = (err) => {
 *    console.log('Live query error', err)
 *  }
 *
 *  let unsubscribe = db.liveQuery('posts').where({}).subscribe(onSnapshot, onError) 
 *
 *  unsubscribe()
 */

class LiveQuery {
  /**
   * Create an instance of the LiveQuery Interface.
   * @param {string} appId 
   * @param {string} db 
   * @param {string} collection 
   * @param {WebSocketClient} client 
   * @param {Object} store 
   */

  constructor(appId, db, collection, client, store) {
    this.appId = appId
    if (db === 'mysql' || db === 'postgres') this.db = `sql-${db}`
    else this.db = db
    this.collection = collection
    this.client = client
    this.store = store
  }

  /**
   * Prepares the find query
   * @param {...Object} conditions - The condition logic.
   */
  where(...conditions) {
    this.find = mongo.generateFind(and(...conditions));
    return this;
  }

  addSubscription(id, onSnapshot, onError) {
    const subscription = { onSnapshot: onSnapshot, onError: onError }
    this.store[this.db][this.collection][id].subscription = subscription
    return () => {
      // TODO: Handle the errors for realtime-unsubscribe
      this.client.request('realtime-unsubscribe', { group: this.collection, id: id })
      delete this.store[this.db][this.collection][id]
    }
  }

  /** 
   * Callback for realtime updates to the subscribed data 
   *  @name OnSnapshot
   *  @function
   *  @param {Array} snapshot The current snapshot
   *  @param {string} type The type of operation performed
   *  @param {Array} docs  Array of new / modified / deleted documents 
   */

  /** 
   * Callback for error while subscribing
   *  @name OnError
   *  @function
   *  @param {string} err - Error during the liveSubscribe
   */

  /** 
   *  The function to unsubscribe the subscription
   *  @name Unsubscribe
   *  @function
   */

  /**
   * Subscribes for real time updates
   * @param {OnSnapshot} onSnapshot - OnSnapshot callback
   * @param {OnError} onError - OnError callback
   * @returns {Unsubscribe} Returns a unsubscribe function
   */
  subscribe(onSnapshot, onError) {
    const id = generateId()
    return this.subscribeRaw(id, onSnapshot, onError)
  }

  subscribeRaw(id, onSnapshot, onError) {
    const req = { id: id, group: this.collection, where: this.find, dbType: this.db, project: this.appId }

    if (!this.store[this.db]) {
      this.store[this.db] = {}
    }
    if (!this.store[this.db][this.collection]) {
      this.store[this.db][this.collection] = {}
    }
    this.store[this.db][this.collection][id] = { snapshot: [], subscription: {}, find: this.find }

    // Add subscription to store
    const unsubscribe = this.addSubscription(id, onSnapshot, onError)

    // Send subscribe request to server
    this.client.request('realtime-subscribe', req).then(data => {
      // Unsubscribe if ack is false
      if (!data.ack) {
        onError(data.error)
        unsubscribe()
        return
      }
      snapshotCallback(this.store, data.docs)
    }).catch(e => {
      // Unsubscribe on error
      onError(e)
      unsubscribe()
    })

    return unsubscribe
  }
}



module.exports = LiveQuery