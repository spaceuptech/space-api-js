const WebSocketClient = require('../websocket/websocket-client').WebSocketClient
const generateId = require('../utils').generateId
const PubsubSubscription = require('./subscription')

/**
 * Class representing the Pubsub Interface.
 * @example
 * const api = new API('my-project');
 * 
 * // For MongoDb Database
 * const pubsub = api.Pubsub();
 * 
 * const onReceive = (subject, data) => {
 *    console.log(subject, data)
 * }
 * 
 * const onError = (error) => {
 *    console.log(error)
 * }
 *
 * let subscription = pubsub.subscribe('/subject/a/', onReceive, onError)
 *
 * subscription.unsubscribe()
 */

class PubsubSubscribe {
  /**
   * Create an instance of the LiveQuery Interface.
   * @param {string} appId 
   * @param {string} subject 
   * @param {string} queue 
   * @param {WebSocketClient} client 
   * @param {Object} store 
   */

  constructor(appId, subject, queue, client, store) {
    this.appId = appId
    this.subject = subject
    this.queue = queue
    this.client = client
    this.store = store
  }

  addSubscription(id, onReceive, onError) {
    this.store[this.subject][this.queue][id] = { onReceive: onReceive, onError: onError }
    return () => {
      // TODO: Handle the errors for pubsub-unsubscribe
      this.client.request('pubsub-unsubscribe', { subject: this.subject, id })
      delete this.store[this.subject][this.queue][id]
    }
  }

  /** 
   * Callback for realtime updates to the subscribed data 
   *  @name OnReceive
   *  @function
   *  @param {string} subject The subject of the data
   *  @param {Object} data The doc that was published
   */

  /** 
   * Callback for error while subscribing
   *  @name OnError
   *  @function
   *  @param {string} err - Error during pubsub subscribe
   */

  /** 
   *  The function to unsubscribe the subscription
   *  @name Unsubscribe
   *  @function
   */

  /**
   * Subscribes for publish updates
   * @param {OnReceive} onReceive - OnReceive callback
   * @param {OnError} onError - OnError callback
   * @returns {Unsubscribe} Returns a unsubscribe function
   */
  subscribe(onReceive, onError) {
    const id = generateId()
    return this.subscribeRaw(id, onReceive, onError)
  }

  subscribeRaw(id, onReceive, onError) {
    const req = { id, subject: this.subject, queue: this.queue, project: this.appId }

    if (!this.store[this.subject]) {
      this.store[this.subject] = {}
    }
    if (!this.store[this.subject][this.queue]) {
      this.store[this.subject][this.queue] = {}
    }
    this.store[this.subject][this.queue][id] = {}

    // Add subscription to store
    const unsubscribe = this.addSubscription(id, onReceive, onError)

    // Send subscribe request to server
    this.client.request('pubsub-subscribe', req).then(data => {
      if (data.status != 200) {
        onError(data.error)
        unsubscribe()
      }
    }).catch(e => {
      onError(e)
      unsubscribe()
    })
    this.client.registerCallback('pubsub-subscribe-feed', (data) => {
      onReceive(data.subject, data.data)
    })

    return new PubsubSubscription(this.subject, unsubscribe)
  }
}

module.exports = PubsubSubscribe