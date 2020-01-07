var { API, cond, and, or } = require("../../index")
const generateId = require('../../lib/utils').generateId;

const api = new API('todo_app', 'http://localhost:4122/')
const db = api.DB("db")

const userId = 'user1'
const otherUserId = 'user2'

// db.liveQuery("todos")
//   .where(cond("user_id", "==", userId))
//   .subscribe(
//     (docs, type, find, changedDoc) => {
//       console.log('Snapshot:', docs, '\nType: ', type, '\nFind: ', find, '\nChangedDoc', changedDoc, '\n\n')
//     },
//     (err) => console.log('Operation failed:', err)
//   )

db.liveQuery("todos")
  .where(cond("userId", "==", userId))
  .options({ changesOnly: false })
  .subscribe(
    (docs, type, find, changedDoc) => {
      // console.log('Snapshot:', docs, '\nType: ', type, '\nFind: ', find, '\nChangedDoc', changedDoc, '\n\n')
    },
    (err) => console.log('Operation failed:', err)
  )

const id1 = generateId()

setTimeout(() => {
  db.insert('todos').doc({ _id: id1, todo: 'some todo 1', user_id: userId }).apply()
  db.insert('todos').doc({ _id: generateId(), todo: 'some todo 2', user_id: otherUserId }).apply()
  db.insert('todos').doc({ _id: generateId(), todo: 'some todo 3', user_id: userId }).apply()
}, 1000)

setTimeout(() => {
  db.update('todos').where(cond('_id', '==', id1)).set({ todo: 'some todo111' }).apply()
}, 2000)

setTimeout(() => {
  db.delete('todos').where(cond('_id', '==', id1)).apply()
}, 3000)

setTimeout(() => {
  db.delete('todos').apply()
}, 4000)
