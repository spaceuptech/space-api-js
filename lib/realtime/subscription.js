/**
 * Class representing the LiveQuerySubscription Interface.
 * 
 */

class LiveQuerySubscription {
  /** 
   *  The function to unsubscribe the subscription
   *  @name Unsubscribe
   *  @function
   */

  /**
   * Create an instance of the LiveQuerySubscription Interface.
   * @param {Unsubscribe} unsubscribeFunc The function to unsubscribe the liveQuery
   * @param {Array} snapshot The initial snapshot
   */

  constructor(unsubscribeFunc, snapshot) {
    this.unsubscribeFunc = unsubscribeFunc
    this.snapshot = snapshot
  }

  /**
   * Gets the snapshot
   * @returns {Array} snapshot - The current snapshot
   */
  getSnapshot() {
    return this.snapshot
  }

  /**
   * Unsubscribes from the liveQuery
   */
  unsubscribe() {
    this.unsubscribeFunc()
  }
}

module.exports = LiveQuerySubscription