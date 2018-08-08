## Classes

<dl>
<dt><a href="#SQL">SQL</a></dt>
<dd><p>Class representing the SQL Client Interface.</p>
</dd>
<dt><a href="#Insert">Insert</a></dt>
<dd><p>Class representing the SQL Insert Interface.</p>
</dd>
<dt><a href="#Get">Get</a></dt>
<dd><p>Class representing the SQL Get Interface.</p>
</dd>
<dt><a href="#Update">Update</a></dt>
<dd><p>Class representing the SQL Update Interface.</p>
</dd>
<dt><a href="#Delete">Delete</a></dt>
<dd><p>Class representing the SQL Delete Interface.</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#User">User</a></dt>
<dd></dd>
<dt><a href="#AuthResponse">AuthResponse</a></dt>
<dd></dd>
</dl>

<a name="SQL"></a>

## SQL
Class representing the SQL Client Interface.

**Kind**: global class  

* [SQL](#SQL)
    * [new SQL(appId, url, options, db)](#new_SQL_new)
    * [.get(table)](#SQL+get) ⇒ [<code>Get</code>](#Get)
    * [.insert(table)](#SQL+insert) ⇒ [<code>Insert</code>](#Insert)
    * [.update(table)](#SQL+update) ⇒ [<code>Update</code>](#Update)
    * [.delete(table)](#SQL+delete) ⇒ [<code>Delete</code>](#Delete)
    * [.profile(id)](#SQL+profile) ⇒ <code>Promise</code>
    * [.editProfile(id, email, name, pass)](#SQL+editProfile) ⇒ <code>Promise</code>
    * [.profiles()](#SQL+profiles) ⇒ <code>Promise</code>
    * [.signIn(email, pass)](#SQL+signIn) ⇒ [<code>Promise.&lt;AuthResponse&gt;</code>](#AuthResponse)
    * [.signUp(email, name, pass, role)](#SQL+signUp) ⇒ [<code>Promise.&lt;AuthResponse&gt;</code>](#AuthResponse)

<a name="new_SQL_new"></a>

### new SQL(appId, url, options, db)
Create an instance of the SQL Client Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| url | <code>string</code> | 
| options | <code>Object</code> | 
| db | <code>string</code> | 

**Example**  
```js
import { API } from 'space-api';

const api = new API('my-project');

// For MySQL Database
const db = api.MySQL();


// For PostgreQL Database
const db = api.Postgres();
```
<a name="SQL+get"></a>

### sqL.get(table) ⇒ [<code>Get</code>](#Get)
Returns a SQL Get Object

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: [<code>Get</code>](#Get) - SQL Get Object  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>string</code> | The table to query records. |

<a name="SQL+insert"></a>

### sqL.insert(table) ⇒ [<code>Insert</code>](#Insert)
Returns a SQL Insert Object

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: [<code>Insert</code>](#Insert) - SQL Insert Object  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>string</code> | The table to insert records. |

<a name="SQL+update"></a>

### sqL.update(table) ⇒ [<code>Update</code>](#Update)
Returns a SQL Update Object

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: [<code>Update</code>](#Update) - SQL Update Object  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>string</code> | The table to update records. |

<a name="SQL+delete"></a>

### sqL.delete(table) ⇒ [<code>Delete</code>](#Delete)
Returns a SQL Delete Object

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: [<code>Delete</code>](#Delete) - SQL Delete Object  

| Param | Type | Description |
| --- | --- | --- |
| table | <code>string</code> | The table to delete records. |

<a name="SQL+profile"></a>

### sqL.profile(id) ⇒ <code>Promise</code>
Fetches the user profile

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: <code>Promise</code> - Return a promise containing response from server  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The unique user id |

**Example**  
```js
db.profile(id).then(res => {
  if (res.status === 200) {
    // res.data.user contains user details
    console.log('Response:', res.data.user);
    return;
  }
  // Request failed
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="SQL+editProfile"></a>

### sqL.editProfile(id, email, name, pass) ⇒ <code>Promise</code>
Updates the user profile

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: <code>Promise</code> - Return a promise containing response from server  

| Param | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The unique user id |
| email | <code>string</code> | The new email id |
| name | <code>string</code> | The new name |
| pass | <code>string</code> | The new password |

**Example**  
```js
db.editProfile(id, email, name, pass).then(res => {
  if (res.status === 200) {
    // User account has been updates successfully
    return;
  }
  // Request failed
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="SQL+profiles"></a>

### sqL.profiles() ⇒ <code>Promise</code>
Fetches all the user profiles

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: <code>Promise</code> - Return a promise containing response from server  
**Example**  
```js
db.profiles().then(res => {
  if (res.status === 200) {
    // res.data.users contains user details
    console.log('Response:', res.data.users);
    return;
  }
  // Request failed
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="SQL+signIn"></a>

### sqL.signIn(email, pass) ⇒ [<code>Promise.&lt;AuthResponse&gt;</code>](#AuthResponse)
Sends a sign in query to the server

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: [<code>Promise.&lt;AuthResponse&gt;</code>](#AuthResponse) - Return a promise containing response from server  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | The user's email id. |
| pass | <code>string</code> | The user's password. |

**Example**  
```js
db.signIn('demo@example.com', '1234').then(res => {
  if (res.status === 200) {
    // Set the token id to enable crud operations
    api.setToken(res.data.token)

    // res.data contains request payload
    console.log('Response:', res.data);
    return;
  }
  // Request failed
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="SQL+signUp"></a>

### sqL.signUp(email, name, pass, role) ⇒ [<code>Promise.&lt;AuthResponse&gt;</code>](#AuthResponse)
Sends a sign up query to the server

**Kind**: instance method of [<code>SQL</code>](#SQL)  
**Returns**: [<code>Promise.&lt;AuthResponse&gt;</code>](#AuthResponse) - Return a promise containing response from server  

| Param | Type | Description |
| --- | --- | --- |
| email | <code>string</code> | The user's email id. |
| name | <code>string</code> | The user's name. |
| pass | <code>string</code> | The user's password. |
| role | <code>string</code> | The user's role. |

**Example**  
```js
db.signUp('demo@example.com', 'UserName', '1234', 'default').then(res => {
  if (res.status === 200) {
    // Set the token id to enable crud operations
    api.setToken(res.data.token)
    
    // res.data contains request payload
    console.log('Response:', res.data);
    return;
  }
  // Request failed
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="Insert"></a>

## Insert
Class representing the SQL Insert Interface.

**Kind**: global class  

* [Insert](#Insert)
    * [new Insert(appId, table, url, options, db)](#new_Insert_new)
    * [.one(record)](#Insert+one) ⇒ <code>Promise</code>
    * [.many(...records)](#Insert+many) ⇒ <code>Promise</code>

<a name="new_Insert_new"></a>

### new Insert(appId, table, url, options, db)
Create an instance of the MongoDB Insert Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| table | <code>string</code> | 
| url | <code>string</code> | 
| options | <code>Object</code> | 
| db | <code>string</code> | 

**Example**  
```js
import { API, cond, or, and } from 'space-api';

const api = new API('my-project');

// For MySQL Database
const db = api.MySQL();

// For Postgres Database
const db = api.Postgres();

const record = { author: 'John', title: 'Title1', _id: 1 };
db.insert('posts').one(record).then(res => {
  if (res.status === 200) {
    // Record was inserted successfully
    return;
  }
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="Insert+one"></a>

### insert.one(record) ⇒ <code>Promise</code>
Makes the query to insert a single record.

**Kind**: instance method of [<code>Insert</code>](#Insert)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  

| Param | Type | Description |
| --- | --- | --- |
| record | <code>Object</code> | The record to be inserted. |

**Example**  
```js
const record = { author: 'John', title: 'Title1', id: 1 };
db.insert('posts').one(record).then(res => ...)
```
<a name="Insert+many"></a>

### insert.many(...records) ⇒ <code>Promise</code>
Makes the query to insert multiple records.

**Kind**: instance method of [<code>Insert</code>](#Insert)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  

| Param | Type | Description |
| --- | --- | --- |
| ...records | <code>Array.&lt;Object&gt;</code> | The records to be inserted. |

**Example**  
```js
const records = [{ author: 'John', title: 'Title1', id: 1 }];
db.insert('posts').many(records).then(res => ...)
```
<a name="Get"></a>

## Get
Class representing the SQL Get Interface.

**Kind**: global class  

* [Get](#Get)
    * [new Get(appId, table, url, options, db)](#new_Get_new)
    * [.where(...conditions)](#Get+where)
    * [.select(select)](#Get+select)
    * [.order(...array)](#Get+order)
    * [.offset(offset)](#Get+offset)
    * [.limit(num)](#Get+limit)
    * [.one()](#Get+one) ⇒ <code>Promise</code>
    * [.all()](#Get+all) ⇒ <code>Promise</code>

<a name="new_Get_new"></a>

### new Get(appId, table, url, options, db)
Create an instance of the SQL Get Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| table | <code>string</code> | 
| url | <code>string</code> | 
| options | <code>Object</code> | 
| db | <code>string</code> | 

**Example**  
```js
import { API, cond, or, and } from 'space-api';

const api = new API('my-project');

// For MySQL Database
const db = api.MySQL();

// For PostgresQL Database
const db = api.Postgres();

db.get('posts').where(and(cond('title', '==', 'Title1'))).all().then(res => {
  if (res.status === 200) {
    // res.data contains the records returned by the database
    console.log('Response:', res.data);
    return;
  }
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="Get+where"></a>

### get.where(...conditions)
Prepares the find query

**Kind**: instance method of [<code>Get</code>](#Get)  

| Param | Type | Description |
| --- | --- | --- |
| ...conditions | <code>Object</code> | The condition logic. |

<a name="Get+select"></a>

### get.select(select)
Sets the fields to be selected

**Kind**: instance method of [<code>Get</code>](#Get)  

| Param | Type | Description |
| --- | --- | --- |
| select | <code>Object</code> | The select object. |

**Example**  
```js
// Given query will only select author and title fields
const select = { author: 1, title: 1 }
db.get('posts').select(select).all().then(res => ...)
```
<a name="Get+order"></a>

### get.order(...array)
Sets the fields to order result by.

**Kind**: instance method of [<code>Get</code>](#Get)  

| Param | Type | Description |
| --- | --- | --- |
| ...array | <code>string</code> | The fields to order result by. |

**Example**  
```js
// Given query will order results first by age (asc) then by age (desc)
db.get('posts').order('title', '-age').all().then(res => ...)
```
<a name="Get+offset"></a>

### get.offset(offset)
Sets the number of records to skip in the array.

**Kind**: instance method of [<code>Get</code>](#Get)  

| Param | Type | Description |
| --- | --- | --- |
| offset | <code>number</code> | The number of records to skip. |

**Example**  
```js
// Given query will skip the first 10 records
db.get('posts').offset(10).all().then(res => ...)
```
<a name="Get+limit"></a>

### get.limit(num)
Sets the limit on number of records returned by the query.

**Kind**: instance method of [<code>Get</code>](#Get)  

| Param | Type | Description |
| --- | --- | --- |
| num | <code>number</code> | The limit on number of records. |

**Example**  
```js
// Given query will limit the result to 10 records
db.get('posts').limit(10).all().then(res => ...)
```
<a name="Get+one"></a>

### get.one() ⇒ <code>Promise</code>
Makes the query to return a single record as an object. If no record are returned, the status code is 400.

**Kind**: instance method of [<code>Get</code>](#Get)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  
**Example**  
```js
db.get('posts').one().then(res => ...)
```
<a name="Get+all"></a>

### get.all() ⇒ <code>Promise</code>
Makes the query to return a multiple records as an array. It is possible for an empty array to be returned.

**Kind**: instance method of [<code>Get</code>](#Get)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  
**Example**  
```js
db.get('posts').all().then(res => ...)
```
<a name="Update"></a>

## Update
Class representing the SQL Update Interface.

**Kind**: global class  

* [Update](#Update)
    * [new Update(appId, table, url, options, db)](#new_Update_new)
    * [.where(...conditions)](#Update+where)
    * [.all(record)](#Update+all) ⇒ <code>Promise</code>

<a name="new_Update_new"></a>

### new Update(appId, table, url, options, db)
Create an instance of the MongoDB Update Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| table | <code>string</code> | 
| url | <code>string</code> | 
| options | <code>Object</code> | 
| db | <code>string</code> | 

**Example**  
```js
import { API, cond, or, and } from 'space-api';

const api = new API('my-project');

// For MySQL Database
const db = api.MySQL();

// For PostgresQL Database
const db = api.Postgres();

db.update('posts').where(and(cond('title', '==', 'Title1'))).all({ title: 'Title2' }).then(res => {
  if (res.status === 200) {
    // The records were updated successfully
    return;
  }
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="Update+where"></a>

### update.where(...conditions)
Prepares the find query

**Kind**: instance method of [<code>Update</code>](#Update)  

| Param | Type | Description |
| --- | --- | --- |
| ...conditions | <code>Object</code> | The condition logic. |

<a name="Update+all"></a>

### update.all(record) ⇒ <code>Promise</code>
Makes the query to update all records which matches.

**Kind**: instance method of [<code>Update</code>](#Update)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  

| Param | Type | Description |
| --- | --- | --- |
| record | <code>Object</code> | Object containing fields and values to set. |

<a name="Delete"></a>

## Delete
Class representing the SQL Delete Interface.

**Kind**: global class  

* [Delete](#Delete)
    * [new Delete(appId, table, url, options, db)](#new_Delete_new)
    * [.where(...conditions)](#Delete+where)
    * [.all()](#Delete+all) ⇒ <code>Promise</code>

<a name="new_Delete_new"></a>

### new Delete(appId, table, url, options, db)
Create an instance of the SQL Delete Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| table | <code>string</code> | 
| url | <code>string</code> | 
| options | <code>Object</code> | 
| db | <code>string</code> | 

**Example**  
```js
import { API, cond, or, and } from 'space-api';

const api = new API('my-project');

// For MySQL Database
const db = api.MySQL();

// For PostgresQL Database
const db = api.Postgres();

db.delete('posts').where(and(cond('title', '==', 'Title1'))).all().then(res => {
  if (res.status === 200) {
    // The records were deleted successfully
    return;
  }
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="Delete+where"></a>

### delete.where(...conditions)
Prepares the find query

**Kind**: instance method of [<code>Delete</code>](#Delete)  

| Param | Type | Description |
| --- | --- | --- |
| ...conditions | <code>Object</code> | The condition logic. |

<a name="Delete+all"></a>

### delete.all() ⇒ <code>Promise</code>
Makes the query to delete all the records which match.

**Kind**: instance method of [<code>Delete</code>](#Delete)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  
**Example**  
```js
db.delete('posts').all().then(res => ...)
```
<a name="User"></a>

## User
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | The user's unique id. |
| email | <code>string</code> | The user's email id. |
| name | <code>string</code> | The user's name. |
| role | <code>string</code> | The user's role. |

<a name="AuthResponse"></a>

## AuthResponse
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| status | <code>number</code> | The http status code of response. |
| data | <code>Object</code> | The response payload. |
| data.token | <code>string</code> | The signed token generated for the user. |
| data.user | [<code>User</code>](#User) | Information of the user. |

