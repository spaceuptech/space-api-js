const LiveQuery = require('./liveQuery')

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
    this.client.registerCallback('realtime-feed', (data) => {
      const obj = this.store[data.dbType][data.group][data.id]
      if (data.type === 'write') {
        let isExisting = false
        obj.snapshot = obj.snapshot.map(row => {
          if (row.id === data.docId) {
            isExisting = true
            if (row.time <= data.time)
              return Object.assign(row, { time: data.time, payload: data.payload, isDeleted: false })
          }

          return row
        })
        if (!isExisting) obj.snapshot.push({ id: data.docId, time: data.time, payload: data.payload, isDeleted: false })
      } else if (data.type === 'delete') {
        obj.snapshot = obj.snapshot.map(row => {
          if (row.id === data.docId && row.time <= data.time)
            return Object.assign(row, { time: data.time, payload: {}, isDeleted: true })
        })
      }
      obj.subscription.onSnapshot(obj.snapshot, data.type, obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload))
    })
  }

  liveQuery(db, collection) {
    return new LiveQuery(this.appId, db, collection, this.client, this.store)
  }
}

module.exports = Realtime