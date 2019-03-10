const LiveQuery = require('./liveQuery')
const snapshotCallback = require('./helper').snapshotCallback

class Realtime {
  constructor(appId, client) {
    this.appId = appId
    this.client = client
    this.store = {}
    this.client.registerOnReconnectCallback(() => {
      Object.keys(this.store).forEach(db => {
        Object.keys(this.store[db]).forEach(col => {
          Object.keys(this.store[db][col]).forEach(id => {
            const obj = this.store[db][col][id]
            this.liveQuery(db, col).where(obj.find).subscribeRaw(id, obj.subscription.onSnapshot, obj.subscription.onError)
          })
        })
      })
    })
    this.client.registerCallback('realtime-feed', (data) => { snapshotCallback(this.store, [data]) })
  }

  liveQuery(db, collection) {
    return new LiveQuery(this.appId, db, collection, this.client, this.store)
  }
}

module.exports = Realtime