## Classes

<dl>
<dt><a href="#LiveQuery">LiveQuery</a></dt>
<dd><p>Class representing the LiveQuery Interface.</p>
</dd>
<dt><a href="#LiveQuerySubscription">LiveQuerySubscription</a></dt>
<dd><p>Class representing the LiveQuerySubscription Interface.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#OnSnapshot">OnSnapshot(docs, type, changedDoc)</a></dt>
<dd><p>Callback for realtime updates to the subscribed data</p>
</dd>
<dt><a href="#OnError">OnError(err)</a></dt>
<dd><p>Callback for error while subscribing</p>
</dd>
</dl>

<a name="LiveQuery"></a>

## LiveQuery
Class representing the LiveQuery Interface.

**Kind**: global class  

* [LiveQuery](#LiveQuery)
    * [new LiveQuery(appId, db, collection, client, store)](#new_LiveQuery_new)
    * [.where(...conditions)](#LiveQuery+where)
    * [.options(opts)](#LiveQuery+options)
    * [.subscribe(onSnapshot, onError)](#LiveQuery+subscribe) ⇒ [<code>LiveQuerySubscription</code>](#LiveQuerySubscription)

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

const onSnapshot  = (docs, type, changedDoc) => {
   console.log(docs, type, changedDoc)
 }

 const onError = (err) => {
   console.log('Live query error', err)
 }

 let subscription = db.liveQuery('posts').where({}).subscribe(onSnapshot, onError) 

 subscription.unsubscribe()
```
<a name="LiveQuery+where"></a>

### liveQuery.where(...conditions)
Prepares the find query

**Kind**: instance method of [<code>LiveQuery</code>](#LiveQuery)  

| Param | Type | Description |
| --- | --- | --- |
| ...conditions | <code>Object</code> | The condition logic. |

<a name="LiveQuery+options"></a>

### liveQuery.options(opts)
Sets the options for the live query

**Kind**: instance method of [<code>LiveQuery</code>](#LiveQuery)  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | The options. (Of the form { changesOnly: true|false }) |

<a name="LiveQuery+subscribe"></a>

### liveQuery.subscribe(onSnapshot, onError) ⇒ [<code>LiveQuerySubscription</code>](#LiveQuerySubscription)
Subscribes for real time updates

**Kind**: instance method of [<code>LiveQuery</code>](#LiveQuery)  
**Returns**: [<code>LiveQuerySubscription</code>](#LiveQuerySubscription) - Returns a LiveQuerySubscription object  

| Param | Type | Description |
| --- | --- | --- |
| onSnapshot | [<code>OnSnapshot</code>](#OnSnapshot) | OnSnapshot callback |
| onError | [<code>OnError</code>](#OnError) | OnError callback |


<a name="LiveQuerySubscription"></a>

## LiveQuerySubscription
Class representing the LiveQuerySubscription Interface.

**Kind**: global class  

* [LiveQuerySubscription](#LiveQuerySubscription)
    * [.getSnapshot())](#LiveQuerySubscription+getSnapshot)
    * [.unsubscribe()](#LiveQuerySubscription+unsubscribe)

<a name="LiveQuerySubscription+getSnapshot"></a>

### liveQuerySubscription.getSnapshot()
Gets the current snapshot

**Kind**: instance method of [<code>LiveQuerySubscription</code>](#LiveQuerySubscription)  

**Returns**: <code>Array</code> - The current snapshot

<a name="LiveQuerySubscription+unsubscribe"></a>

## Unsubscribe()
The function to unsubscribe the subscription

**Kind**: instance method of [<code>LiveQuerySubscription</code>](#LiveQuerySubscription)  

<a name="OnSnapshot"></a>

## OnSnapshot(docs, type, changedDoc)
Callback for realtime updates to the subscribed data

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| docs | <code>Array</code> | The updated docs |
| type | <code>string</code> | The type of operation performed |
| changedDoc | <code>Object</code> | The doc that changed |

<a name="OnError"></a>

## OnError(err)
Callback for error while subscribing

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>string</code> | Error during the liveSubscribe |

