var { API, cond, and, or } = require("../../index")
const generateId = require('../../lib/utils').generateId;

const api = new API('todo-app', 'http://localhost:4122/')
const db = api.Mongo()

const onSnapshot = (docs, type, changedDoc) => {
  console.log('Snapshot:', docs, 'Type: ', type, 'ChangedDoc: ', changedDoc)
}

const onError = (err) => {
  console.log('Operation failed:', err)
}
var userId = ''
db.signIn('a@a.a', '123').then(res => {
  if (res.status !== 200) {
    throw new Error('Could not log in')
  }
  userId = res.data.user._id
  // Get todos from the database
  db.liveQuery("todos")
    .where(cond("userId", "==", userId))
    .subscribe(onSnapshot, onError)
}).catch(e => {
  console.log("eror", e)
})

setTimeout(() => {
  const id1 = generateId()
  db.insert('todos').one({_id: id1, todo: 'some todo11', userId: userId}).then(res => {
    //console.log(res)
  })
  db.insert('todos').one({_id: generateId(), todo: 'some todo33', userId: userId}).then(res => {
    //console.log(res)
  })
  db.insert('todos').one({_id: generateId(), todo: 'some todo22', userId: 'userId'}).then(res => {
    //console.log(res)
  })
  db.update('todos').where(cond('_id', '==', id1)).set({todo: 'some todo111'}).one().then(res => {})
}, 3000)