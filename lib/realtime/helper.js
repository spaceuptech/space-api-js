exports.snapshotCallback = (store, rows) => {
  if (rows.length === 0) return
  var obj = {}
  rows.forEach(data => {
    obj = store[data.dbType][data.group][data.id]
    if (data.type === 'insert' || data.type ==='update') {
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
  });
  const changeType = rows.length == 1 ? rows[0].type : 'initial'
  obj.subscription.onSnapshot(obj.snapshot.filter(row => (!row.isDeleted)).map(row => row.payload), changeType)
}
