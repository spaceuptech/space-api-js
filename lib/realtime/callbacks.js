const { validate, loadValue, storeValue } = require('../utils')
const isEqual = require('underscore').isEqual

exports.monitorCallBack = (store, dbName, collectionName, data) => {
  // If error in monitoring, call the error callback
  if (!data.ack) {
    Object.keys(store[dbName]).forEach(key => {
      store[dbName][key].subscriptions.forEach(sub => {
        sub.onError('failed to subscribe')
      })
    })
    return
  }

  // Call onSnapshot callback with the initial snapshot 
  if (store[dbName][collectionName]) {
    store[dbName][collectionName].subscriptions.forEach(sub => {
      store[dbName][collectionName].snapshot = data.docs ? data.docs : []
      sub.onSnapshot(store[dbName][collectionName].snapshot, 'monitor')
    })
  }
}

exports.realTimeCallBack = (store, dbName, collectionName, uniqueKeys, data) => {
  let collection = store[dbName][collectionName]
  if (collection) {
    let snapshot = collection.snapshot.slice()
    let subscriptions = collection.subscriptions
    switch (data.type) {
      case 'insert':
        let newDocs = data.op === 'one' ? [data.doc] : data.doc
        newDocs = newDocs.filter(doc => snapshot.findIndex(obj => {
          let found = true
          uniqueKeys.forEach(key => {
            if (doc[key] !== obj[key]) {
              found = false
              return
            }
          })
          return found
        }) < 0)
        if (newDocs.length > 0) {
          snapshot = snapshot.concat(newDocs)
          collection.snapshot = snapshot
          subscriptions.forEach(subscription => {
            subscription.onSnapshot(snapshot, 'insert', newDocs)
          })
        }
        break
      case 'update':
        if (data.op === 'all') {
          let updatedDocs = []
          const len = snapshot.length
          for (let i = 0; i < len; i++) {
            let obj = Object.assign({}, snapshot[i])
            if (validate(data.find, obj)) {
              Object.keys(data.update).forEach(key => {
                switch (key) {
                  case '$set':
                    Object.keys(data.update.$set).forEach(subKey => storeValue(obj, subKey, loadValue(data.update.$set, subKey).value))
                    break
                  default:
                    if (!key.startsWith('$')) {
                      obj = Object.assign(obj, {
                        [key]: data.update[key]
                      })
                    }
                }
              })
            }
            if (!isEqual(snapshot[i], obj)) {
              updatedDocs.push(obj)
              snapshot[i] = obj
            }
          }
          if (updatedDocs.length > 0) {
            collection.snapshot = snapshot
            subscriptions.forEach(subscription => {
              subscription.onSnapshot(snapshot, 'update', updatedDocs)
            })
          }
        }
        break
      case 'delete':
        if (data.op === 'all') {
          let deletedDocs = []
          snapshot = snapshot.filter(obj => {
            if (!validate(data.find, obj)) {
              return true
            }
            deletedDocs.push(obj)
            return false
          })
          if (deletedDocs.length > 0) {
            collection.snapshot = snapshot
            subscriptions.forEach(subscription => {
              subscription.onSnapshot(snapshot, 'delete', deletedDocs)
            })
          }
        }
        break
    }
  }
}