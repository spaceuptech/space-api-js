const Monitor = require('./monitor')

class Realtime {
  constructor(appId, client) {
    this.appId = appId
    this.client = client
    this.store = {}
    this.client.registerOnReconnectCallback(() => {
      Object.keys(this.store).forEach(db => {
        Object.keys(this.store[db]).forEach(col => {
          let eventName
          switch (db) {
            case 'mongo':
              eventName = 'MongoDB Abstraction|monitor'
              break
            case 'mysql':
              eventName = 'SQL Abstraction|monitor'
              break
            case 'postgres':
              eventName = 'SQL Abstraction|monitor'
              break
          }
          this.client.send(eventName, { appId: this.appId, col: col, db: db, find: this.store[db][col].find })
        })
      })
    })
  }

  monitor(db, collection, uniqueKeys) {
    return new Monitor(this.appId, db, collection, this.client, this.store, uniqueKeys)
  }
}

module.exports = Realtime