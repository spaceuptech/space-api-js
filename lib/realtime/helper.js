exports.snapshotCallback = (store, rows) => {
  if (rows.length === 0) return
  var obj = {}
  var opts = {}
  rows.forEach(data => {
    obj = store[data.dbType][data.group][data.id]
    opts = obj.opts
    if (opts.changesOnly) {
      if (!(opts.skipInitial && data.type === 'initial')) {
        if (data.type != 'delete') {
          obj.subscription.onSnapshot([], data.type, data.payload)
        } else {
          if (data.dbType === 'mongo') {
            obj.subscription.onSnapshot([], data.type, { _id: data.docId })
          } else {
            obj.subscription.onSnapshot([], data.type, { id: Number(data.docId) })
          }
        }
      }
    } else {
      if (data.type === 'initial') {
        obj.snapshot.push({ id: data.docId, time: data.time, payload: data.payload, isDeleted: false })
      } else if (data.type === 'insert' || data.type === 'update') {
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
          return row
        })
      }
    }
  });
  if (!opts.changesOnly) {
    const changeType = rows[0].type
    if (changeType === 'initial') {
      if (!opts.skipInitial) {
        obj.subscriptionObject.snapshot = obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload)
        obj.subscription.onSnapshot(obj.subscriptionObject.snapshot, changeType, {})
      }
    } else {
      if (changeType !== 'delete') {
        obj.subscriptionObject.snapshot = obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload)
        obj.subscription.onSnapshot(obj.subscriptionObject.snapshot, changeType, rows[0].payload)
      } else {
        if (rows[0].dbType === 'mongo') {
          obj.subscriptionObject.snapshot = obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload)
          obj.subscription.onSnapshot(obj.subscriptionObject.snapshot, changeType, { _id: rows[0].docId })
        } else {
          obj.subscriptionObject.snapshot = obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload)
          obj.subscription.onSnapshot(obj.subscriptionObject.snapshot, changeType, { id: Number(rows[0].docId) })
        }
      }
    }
  }
}
