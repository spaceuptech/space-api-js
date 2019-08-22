const PubsubSubscribe = require('./pubsubSubscribe')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync;

class Pubsub {
  constructor(url, appId, client) {
    this.url = url
    this.appId = appId
    this.client = client
    this.store = {}
    this.client.registerOnReconnectCallback(() => {
      Object.keys(this.store).forEach(subject => {
        Object.keys(this.store[subject]).forEach(queue => {
          Object.keys(this.store[subject][queue]).forEach(id => {
            const obj = this.store[subject][queue][id]
            var q = this.queueSubscribe(subject, queue)
            // q.subscribeRaw(id, obj.onReceive, obj.onError);
          })
        })
      })
    })
    this.client.registerCallback('pubsub-subscribe-feed', (data) => {
      Object.keys(this.store).forEach(subject => {
        Object.keys(this.store[subject]).forEach(queue => {
          Object.keys(this.store[subject][queue]).forEach(id => {
            if(data.id == id) {
              this.store[subject][queue][data.id].onReceive(data.msg.subject, data.msg.data)
            }
          })
        })
      })
    })
  }

  queueSubscribe(subject, queue, onReceive, onError) {
    let s = new PubsubSubscribe(this.appId, subject, queue, this.client, this.store)
    return s.subscribe(onReceive, onError)
  }

  subscribe(subject, onReceive, onError) {
    return this.queueSubscribe(subject, "", onReceive, onError)
  }

  publish(subject, data) {
    let options = { method: 'POST' };
    options.body = JSON.stringify({ subject, data });
    let url = `${this.url}v1/api/${this.appId}/pubsub`
    return fetchAsync(url, options);
  }
}

module.exports = Pubsub