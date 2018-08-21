# Client API for Space Cloud

## Installation

```bash
$ npm install space-api --save
```

## Documentation
The complete documentation can be found [here](https://github.com/spaceuptech/space-api-js/wiki).

Documentation for specific databases is given below:
- [MongoDB](https://github.com/spaceuptech/space-api-js/wiki/Mongo)
- [SQL Databases](https://github.com/spaceuptech/space-api-js/wiki/SQL)

## Quick Start

### Create Client Instance

```js
import { API, and, or, cond } from 'space-api';

const api = new API('demo-project');

// For MongoDB
const db = api.Mongo();

// For PostgresQL
const db = api.Postgres();

// For MySQL
const db = api.MySQL();
```
**Note: Multiple databases may be used simultaneously.**

### Insert a document into the database
```js
const doc = {_id: 1, title: "Title 1", content: "My first record"};
db.insert('COLLECTION_NAME').one(doc).then(res => {
  if (res.status === 200) {
    // Document inserted successfully
    return;
  }
}).catch(ex => {
  // Exception occured while processing request
});
```
**Note: Always insert documents with a id in order to use the realtime feature.**

### Query documents in database
```js
const find = and(cond('title', '==', 'Title1'), cond('author', '==', 'Jon'));
db.get('COLLECTION_NAME').where(find)
  .skip(10).limit(10)
  .all()
  .then(res => {
    if (res.status === 200) {
      // res.data contains the documents returned by the database
      console.log('Response:', res.data);
      return;
    }
  }).catch(ex => {
    // Exception occured while processing request
  });
```

### Update documents in database
```js
const find = and(cond('author', '==', 'Jon'));
db.update('COLLECTION_NAME').where(find)
  .set({ author: 'John' })
  .all()
  .then(res => {
    if (res.status === 200) {
      // Document updated successfully
      return;
    }
  }).catch(ex => {
    // Exception occured while processing request
  });
```

### Delete documents in database
```js
const find = and(cond('author', '==', 'John'));
db.delete('COLLECTION_NAME').where(find)
  .many()
  .then(res => {
    if (res.status === 200) {
      // Document deleted successfully
      return;
    }
  }).catch(ex => {
    // Exception occured while processing request
  });
```

### Get real time updates
```js
const onSnapshot  = (snapshot, type, docs) => {
  if (type === 'monitor') {
    console.log('Monitored successfully ', snapshot)
      return
    }
    console.log(type, snapshot, docs)
   }
 
const onError = (err) => {
  console.log('Monitor error', err)
}
 
let unsubscribe = db.monitor('posts').where().subscribe(onSnapshot, onError) 
 
unsubscribe()
```

## License

Copyright 2018 Noorain Panjwani

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
