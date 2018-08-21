const mongo = require('../mongo/mongo')
const and = require('../utils').and
const WebSocketClient = require('../websocket/websocket-client').WebSocketClient
const isEqual = require('underscore').isEqual
var generateId = require('time-uuid');
const { realTimeCallBack, monitorCallBack } = require('./callbacks')

/**
 * Class representing the Monitor Interface.
 * @example
 * import { API, cond, or, and } from 'space-api';
 * const api = new API('my-project');
 * 
 * // For MongoDb Database
 * const db = api.Mongo();
 * 
 * const onSnapshot  = (snapshot, type, docs) => {
 *   if (type === 'monitor') {
 *      console.log('Monitored successfully ', snapshot)
 *      return
 *    }
 *    console.log(type, snapshot, docs)
 *  }
 *
 *  const onError = (err) => {
 *    console.log('Monitor error', err)
 *  }
 *
 *  let unsubscribe = db.monitor('posts').where().subscribe(onSnapshot, onError) 
 *
 *  unsubscribe()
 */

class Monitor {
  /**
   * Create an instance of the Monitor Interface.
   * @param {string} appId 
   * @param {string} db 
   * @param {string} collection 
   * @param {WebSocketClient} client 
   * @param {Object} store 
   * @param {Array} uniqueKeys
   */

  constructor(appId, db, collection, client, store, uniqueKeys) {
    this.appId = appId
    this.db = db
    this.collection = collection
    this.client = client
    this.store = store
    this.uniqueKeys = uniqueKeys
  }

  /**
   * Prepares the find query
   * @param {...Object} conditions - The condition logic.
   */
  where(...conditions) {
    this.find = mongo.generateFind(and(...conditions));
    return this;
  }

  addSubscription(onSnapshot, onError) {
    const subscription = { id: generateId(), onSnapshot: onSnapshot, onError: onError }
    this.store[this.db][this.collection].subscriptions.push(subscription)
    return () => {
      this.store[this.db][this.collection].subscriptions = this.store[this.db][this.collection].subscriptions.filter(obj => obj.id !== subscription.id)
      if (this.store[this.db][this.collection].subscriptions.length === 0) {
        delete this.store[this.db][this.collection]
        this.client.unregisterCallback(`realtime:${this.appId}:${this.db}:${this.collection}`)
      }
    }
  }


  monitor() {
    let monitorEventName
    switch (this.db) {
      case 'mongo':
        monitorEventName = 'MongoDB Abstraction|monitor'
        break
      case 'mysql':
        monitorEventName = 'SQL Abstraction|monitor'
        break
      case 'postgres':
        monitorEventName = 'SQL Abstraction|monitor'
        break
    }
    this.client.send(monitorEventName, { appId: this.appId, col: this.collection, find: this.find, db: this.db })
    this.client.registerCallback(monitorEventName, (data) => monitorCallBack(this.store, this.db, this.collection, data))
    this.client.registerCallback(`realtime:${this.appId}:${this.db}:${this.collection}`, (data) => realTimeCallBack(this.store, this.db, this.collection, this.uniqueKeys, data))
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
   *  @param {string} err Error while monitoring
   */

  /** 
   *  The function to unsubscribe the subscription
   *  @name Unsubscribe
   *  @function
   */

  /**
   * Subcribes for real time updates
   * @param {OnSnapshot} onSnapshot - OnSnapshot callback
   * @param {OnError} onError - OnError callback
   * @returns {Unsubscribe} Returns a unsubscribe function
   */
  subscribe(onSnapshot, onError) {
    if (this.store[this.db] && this.store[this.db][this.collection]) {
      if (!isEqual(this.store[this.db][this.collection].find, this.find)) {
        this.store[this.db][this.collection] = { snapshot: [], subscriptions: [], find: this.find }
        this.monitor()
      }
      return this.addSubscription(onSnapshot, onError)
    }
    if (!this.store[this.db]) {
      this.store[this.db] = {
        [this.collection]: { snapshot: [], subscriptions: [], find: this.find }
      }
    }
    if (!this.store[this.db][this.collection]) {
      this.store[this.db][this.collection] = { snapshot: [], subscriptions: [], find: this.find }
    }
    this.monitor()
    return this.addSubscription(onSnapshot, onError)
  }
}



module.exports = Monitor