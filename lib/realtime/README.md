## Classes

<dl>
<dt><a href="#LiveQuery">LiveQuery</a></dt>
<dd><p>Class representing the LiveQuery Interface.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#OnSnapshot">OnSnapshot(docs, type)</a></dt>
<dd><p>Callback for realtime updates to the subscribed data</p>
</dd>
<dt><a href="#OnError">OnError(err)</a></dt>
<dd><p>Callback for error while subscribing</p>
</dd>
<dt><a href="#Unsubscribe">Unsubscribe()</a></dt>
<dd><p>The function to unsubscribe the subscription</p>
</dd>
</dl>

<a name="LiveQuery"></a>

## LiveQuery
Class representing the LiveQuery Interface.

**Kind**: global class  

* [LiveQuery](#LiveQuery)
    * [new LiveQuery(appId, db, collection, client, store)](#new_LiveQuery_new)
    * [.where(...conditions)](#LiveQuery+where)
    * [.subscribe(onSnapshot, onError)](#LiveQuery+subscribe) ⇒ [<code>Unsubscribe</code>](#Unsubscribe)

<a name="new_LiveQuery_new"></a>

### new LiveQuery(appId, db, collection, client, store)
Create an instance of the LiveQuery Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| db | <code>string</code> | 
| collection | <code>string</code> | 
| client | <code>WebSocketClient</code> | 
| store | <code>Object</code> | 

**Example**  
```js
import { API, cond, or, and } from 'space-api';
const api = new API('my-project');

// For MongoDb Database
const db = api.Mongo();

const onSnapshot  = (docs, type) => {
   console.log(docs, snapshot)
 }

 const onError = (err) => {
   console.log('Live query error', err)
 }

 let unsubscribe = db.liveQuery('posts').where({}).subscribe(onSnapshot, onError) 

 unsubscribe()
```
<a name="LiveQuery+where"></a>

### liveQuery.where(...conditions)
Prepares the find query

**Kind**: instance method of [<code>LiveQuery</code>](#LiveQuery)  

| Param | Type | Description |
| --- | --- | --- |
| ...conditions | <code>Object</code> | The condition logic. |

<a name="LiveQuery+subscribe"></a>

### liveQuery.subscribe(onSnapshot, onError) ⇒ [<code>Unsubscribe</code>](#Unsubscribe)
Subscribes for real time updates

**Kind**: instance method of [<code>LiveQuery</code>](#LiveQuery)  
**Returns**: [<code>Unsubscribe</code>](#Unsubscribe) - Returns a unsubscribe function  

| Param | Type | Description |
| --- | --- | --- |
| onSnapshot | [<code>OnSnapshot</code>](#OnSnapshot) | OnSnapshot callback |
| onError | [<code>OnError</code>](#OnError) | OnError callback |

<a name="OnSnapshot"></a>

## OnSnapshot(docs, type)
Callback for realtime updates to the subscribed data

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| docs | <code>Array</code> | The updated docs |
| type | <code>string</code> | The type of operation performed |

<a name="OnError"></a>

## OnError(err)
Callback for error while subscribing

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>string</code> | Error during the liveSubscribe |

<a name="Unsubscribe"></a>

## Unsubscribe()
The function to unsubscribe the subscription

**Kind**: global function  
