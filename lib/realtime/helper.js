exports.snapshotCallback = (store, rows) => {
  if (!rows || rows.length === 0) return
  var obj = {}
  var opts = {}
  rows.forEach(data => {
    obj = store[data.dbType][data.group][data.id]
    if (obj) {
      opts = obj.opts
      if (data.type === 'initial') {
        obj.snapshot.push({ find: data.find, time: data.time, payload: data.payload, isDeleted: false })
      } else if (data.type === 'insert' || data.type === 'update') {
        let isExisting = false
        obj.snapshot = obj.snapshot.map(row => {
          if (matchFindClause(row.payload, data.find)) {
            isExisting = true
            if (row.time <= data.time)
              return Object.assign(row, { time: data.time, payload: data.payload, isDeleted: false })
          }
          return row
        })
        if (!isExisting) obj.snapshot.push({ find: data.find, time: data.time, payload: data.payload, isDeleted: false })
      } else if (data.type === 'delete') {
        obj.snapshot = obj.snapshot.map(row => {
          if (matchFindClause(row.payload, data.find) && row.time <= data.time)
            return Object.assign(row, { time: data.time, payload: {}, isDeleted: true })
          return row
        })
      }
      const changeType = rows[0].type
      if (changeType === 'initial') {
        if (!opts.skipInitial) {
          obj.subscriptionObject.snapshot = obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload)
          obj.subscription.onSnapshot(obj.subscriptionObject.snapshot, changeType)
        }
      } else {
        if (changeType !== 'delete') {
          obj.subscriptionObject.snapshot = obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload)
          obj.subscription.onSnapshot(obj.subscriptionObject.snapshot, changeType, rows[0].find, rows[0].payload)
        } else {
          obj.subscriptionObject.snapshot = obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload)
          obj.subscription.onSnapshot(obj.subscriptionObject.snapshot, changeType, rows[0].find)
        }
      }
    }
  });
}

const matchFindClause = (obj, find) => {
  return Object.entries(find).every(([key, value]) => {
    return obj[key] == value
  })
}
