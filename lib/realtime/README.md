## Classes

<dl>
<dt><a href="#Monitor">Monitor</a></dt>
<dd><p>Class representing the Monitor Interface.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#OnSnapshot">OnSnapshot(snapshot, type, docs)</a></dt>
<dd><p>Callback for realtime updates to the subscribed data</p>
</dd>
<dt><a href="#OnError">OnError(err)</a></dt>
<dd><p>Callback for error while subscribing</p>
</dd>
<dt><a href="#Unsubscribe">Unsubscribe()</a></dt>
<dd><p>The function to unsubscribe the subscription</p>
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
import { API, cond, or, and } from 'space-api-node';
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
Subcribes for real time updates

**Kind**: instance method of [<code>Monitor</code>](#Monitor)  
**Returns**: [<code>Unsubscribe</code>](#Unsubscribe) - Returns a unsubscribe function  

| Param | Type | Description |
| --- | --- | --- |
| onSnapshot | [<code>OnSnapshot</code>](#OnSnapshot) | OnSnapshot callback |
| onError | [<code>OnError</code>](#OnError) | OnError callback |

<a name="OnSnapshot"></a>

## OnSnapshot(snapshot, type, docs)
Callback for realtime updates to the subscribed data

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| snapshot | <code>Array</code> | The current snapshot |
| type | <code>string</code> | The type of operation performed |
| docs | <code>Array</code> | Array of new / modified / deleted documents |

<a name="OnError"></a>

## OnError(err)
Callback for error while subscribing

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>string</code> | Error while monitoring |

<a name="Unsubscribe"></a>

## Unsubscribe()
The function to unsubscribe the subscription

**Kind**: global function  
