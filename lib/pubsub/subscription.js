/**
 * Class representing the PubsubSubscription Interface.
 * 
 */

class PubsubSubscription {
  /** 
   *  The function to unsubscribe the subscription
   *  @name Unsubscribe
   *  @function
   */

  /**
   * Create an instance of the PubsubSubscription Interface.
   * @param {string} subject The subject of the subscription
   * @param {Unsubscribe} unsubscribeFunc The function to unsubscribe the Pubsub
   */

  constructor(subject, unsubscribeFunc) {
    this.subject = subject
    this.unsubscribeFunc = unsubscribeFunc
  }

  /**
   * Gets the subject
   * @returns {string} subject - The subject of the susbscription
   */
  getSubject() {
    return this.subject
  }

  /**
   * Unsubscribes from the Pubsub
   */
  unsubscribe() {
    this.unsubscribeFunc()
  }
}

module.exports = PubsubSubscription