## Classes

<dl>
<dt><a href="#Monitor">Monitor</a></dt>
<dd><p>Class representing the Monitor Interface.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#OnSnapshot">OnSnapshot(snapshot, type, docs)</a></dt>
<dd><p>Description of the function</p>
</dd>
<dt><a href="#OnError">OnError(err)</a></dt>
<dd><p>Description of the function</p>
</dd>
<dt><a href="#Unsubscribe">Unsubscribe()</a></dt>
<dd><p>Description of the function</p>
</dd>
</dl>

<a name="Monitor"></a>

## Monitor
Class representing the Monitor Interface.

**Kind**: global class  

* [Monitor](#Monitor)
    * [new Monitor(appId, db, collection, client, store, uniqueKeys)](#new_Monitor_new)
    * [.where(...conditions)](#Monitor+where)
    * [.subscribe(onSnapshot, onError)](#Monitor+subscribe) ⇒ [<code>Unsubscribe</code>](#Unsubscribe)

<a name="new_Monitor_new"></a>

### new Monitor(appId, db, collection, client, store, uniqueKeys)
Create an instance of the Monitor Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| db | <code>string</code> | 
| collection | <code>string</code> | 
| client | <code>WebSocketClient</code> | 
| store | <code>Object</code> | 
| uniqueKeys | <code>Array</code> | 

**Example**  
```js
import { API, cond, or, and } from 'space-api';
const api = new API('my-project');

// For MongoDb Database
const db = api.Mongo();

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
<a name="Monitor+where"></a>

### monitor.where(...conditions)
Prepares the find query

**Kind**: instance method of [<code>Monitor</code>](#Monitor)  

| Param | Type | Description |
| --- | --- | --- |
| ...conditions | <code>Object</code> | The condition logic. |

<a name="Monitor+subscribe"></a>

### monitor.subscribe(onSnapshot, onError) ⇒ [<code>Unsubscribe</code>](#Unsubscribe)
Prepares the find query

**Kind**: instance method of [<code>Monitor</code>](#Monitor)  
**Returns**: [<code>Unsubscribe</code>](#Unsubscribe) - Returns a unsubscribe function  

| Param | Type | Description |
| --- | --- | --- |
| onSnapshot | [<code>OnSnapshot</code>](#OnSnapshot) | OnSnapshot callback |
| onError | [<code>OnError</code>](#OnError) | OnError callback |

<a name="OnSnapshot"></a>

## OnSnapshot(snapshot, type, docs)
Description of the function

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| snapshot | <code>Array</code> | The current snapshot |
| type | <code>string</code> | The type of operation performed |
| docs | <code>Array</code> | Array of new / modified / deleted documents |

<a name="OnError"></a>

## OnError(err)
Description of the function

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>string</code> | Error while monitoring |

<a name="Unsubscribe"></a>

## Unsubscribe()
Description of the function

**Kind**: global function  
