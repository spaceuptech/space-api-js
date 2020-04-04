## Classes

<dl>
<dt><a href="#Api">Api</a></dt>
<dd><p>Class representing the client api.</p>
</dd>
<dt><a href="#QueueEvent">QueueEvent</a></dt>
<dd><p>Class representing the Queue Event Interface.</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_DB">DB</a></dt>
<dd><p>The DB Client Interface.</p>
</dd>
<dt><a href="#external_Realtime">Realtime</a></dt>
<dd><p>The Realtime Client Interface.</p>
</dd>
<dt><a href="#external_FileStore">FileStore</a></dt>
<dd><p>The FileStore Client Interface.</p>
</dd>
</dl>

<a name="Api"></a>

## Api
Class representing the client api.

**Kind**: global class  

* [Api](#Api)
    * [new Api(projectId, url)](#new_Api_new)
    * [.setToken(token)](#Api+setToken)
    * [.setProjectId(projectId)](#Api+setProjectId)
    * ~~[.Mongo()](#Api+Mongo) ⇒ [<code>DB</code>](#external_DB)~~
    * ~~[.Postgres()](#Api+Postgres) ⇒ [<code>DB</code>](#external_DB)~~
    * ~~[.MySQL()](#Api+MySQL) ⇒ [<code>DB</code>](#external_DB)~~
    * [.DB(db)](#Api+DB) ⇒ [<code>DB</code>](#external_DB)
    * [.call(service, endpoint, params, [timeout])](#Api+call) ⇒ <code>Promise</code>
    * [.queueEvent(type, payload)](#Api+queueEvent) ⇒ <code>Promise</code>
    * [.FileStore()](#Api+FileStore) ⇒ [<code>FileStore</code>](#external_FileStore)

<a name="new_Api_new"></a>

### new Api(projectId, url)
Create an instance of the Client API.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| projectId | <code>string</code> |  | The Project Id. |
| url | <code>string</code> | <code>&quot;/&quot;</code> | Base url of space-cloud server. |

**Example**  
```js
import { API } from 'space-api';

const api = new API('my-project', 'http://localhost:4122');
```
<a name="Api+setToken"></a>

### api.setToken(token)
Initialse the Client Api with the JWT token

**Kind**: instance method of [<code>Api</code>](#Api)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>string</code> | The signed JWT token received from the server on successful authentication. |

<a name="Api+setProjectId"></a>

### api.setProjectId(projectId)
Set the new Project Id

**Kind**: instance method of [<code>Api</code>](#Api)  

| Param | Type | Description |
| --- | --- | --- |
| projectId | <code>string</code> | The Project Id. |

<a name="Api+Mongo"></a>

### ~~api.Mongo() ⇒ [<code>DB</code>](#external_DB)~~
***Deprecated***

Returns a Mongo DB client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>DB</code>](#external_DB) - DB client instance  
<a name="Api+Postgres"></a>

### ~~api.Postgres() ⇒ [<code>DB</code>](#external_DB)~~
***Deprecated***

Returns a Postgres DB client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>DB</code>](#external_DB) - DB client instance  
<a name="Api+MySQL"></a>

### ~~api.MySQL() ⇒ [<code>DB</code>](#external_DB)~~
***Deprecated***

Returns a MySQL Db client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>DB</code>](#external_DB) - Db client instance  
<a name="Api+DB"></a>

### api.DB(db) ⇒ [<code>DB</code>](#external_DB)
Returns a DB client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>DB</code>](#external_DB) - DB client instance  

| Param | Type | Description |
| --- | --- | --- |
| db | <code>string</code> | The alias name of the database |

<a name="Api+call"></a>

### api.call(service, endpoint, params, [timeout]) ⇒ <code>Promise</code>
Calls an endpoint from the remote service

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Promise</code> - Returns a promise  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| service | <code>string</code> |  | The name of service |
| endpoint | <code>string</code> |  | The name of endpoint to be called |
| params | <code>Object</code> |  | The params to be sent to the remote service |
| [timeout] | <code>string</code> | <code>5000</code> | Timeout in milliseconds |

**Example**  
```js
api.call('my_service', 'my_endpoint', { msg: 'Remote services are awesome!' }, 1000)
.then(res => {
  if (res.status === 200) {
    // res.data contains the response given by the function
    console.log('Response:', res.data);
    return;
  }
}).catch(ex => {
  // Exception occured while processing request
});
```
<a name="Api+queueEvent"></a>

### api.queueEvent(type, payload) ⇒ <code>Promise</code>
Queues an event

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Promise</code> - Returns a promise  

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | The type of event |
| payload | <code>string</code> | Event payload |

**Example**  
```js
const res = await api.queueEvent("event-type", {"foo": "bar"})
 .delay(0)
 .date(new Date("2025-06-25"))
 .options({})
 .apply()
```
<a name="Api+FileStore"></a>

### api.FileStore() ⇒ [<code>FileStore</code>](#external_FileStore)
Returns a FileStore client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>FileStore</code>](#external_FileStore) - FileStore client instance  
<a name="QueueEvent"></a>

## QueueEvent
Class representing the Queue Event Interface.

**Kind**: global class  

* [QueueEvent](#QueueEvent)
    * [new QueueEvent(appId, url, options, eventType, eventPayload)](#new_QueueEvent_new)
    * [.synchronous()](#QueueEvent+synchronous)
    * [.delay(delay)](#QueueEvent+delay)
    * [.date(date)](#QueueEvent+date)
    * [.apply()](#QueueEvent+apply) ⇒ <code>Promise</code>

<a name="new_QueueEvent_new"></a>

### new QueueEvent(appId, url, options, eventType, eventPayload)
Create an instance of the DB Get Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| url | <code>string</code> | 
| options | <code>Object</code> | 
| eventType | <code>string</code> | 
| eventPayload | <code>Object</code> | 

**Example**  
```js
import { API, cond, or, and } from 'space-api';

const api = new API('my-project', 'http://localhost:4122');
const res = await api.queueEvent("event-type", {"foo": "bar"})
 .delay(0)
 .date(new Date("2025-06-25"))
 .options({})
 .apply()
```
<a name="QueueEvent+synchronous"></a>

### queueEvent.synchronous()
Queues the event synchronously

**Kind**: instance method of [<code>QueueEvent</code>](#QueueEvent)  
<a name="QueueEvent+delay"></a>

### queueEvent.delay(delay)
Seconds to delay the webhook trigger by

**Kind**: instance method of [<code>QueueEvent</code>](#QueueEvent)  

| Param | Type | Description |
| --- | --- | --- |
| delay | <code>Number</code> | delay in seconds. |

<a name="QueueEvent+date"></a>

### queueEvent.date(date)
Date to schedule the event for

**Kind**: instance method of [<code>QueueEvent</code>](#QueueEvent)  

| Param | Type | Description |
| --- | --- | --- |
| date | <code>Object</code> | Date object. |

<a name="QueueEvent+apply"></a>

### queueEvent.apply() ⇒ <code>Promise</code>
Makes the query to queue the event. In case of synchronous events it will resolve to the response object from the webhook.

**Kind**: instance method of [<code>QueueEvent</code>](#QueueEvent)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  
<a name="external_DB"></a>

## DB
The DB Client Interface.

**Kind**: global external  
**See**: [https://github.com/spaceuptech/space-api-js/wiki/DB](https://github.com/spaceuptech/space-api-js/wiki/DB)  
<a name="external_Realtime"></a>

## Realtime
The Realtime Client Interface.

**Kind**: global external  
**See**: [https://github.com/spaceuptech/space-api-js/wiki/Realtime](https://github.com/spaceuptech/space-api-js/wiki/Realtime)  
<a name="external_FileStore"></a>

## FileStore
The FileStore Client Interface.

**Kind**: global external  
**See**: [https://github.com/spaceuptech/space-api-js/wiki/FileStore](https://github.com/spaceuptech/space-api-js/wiki/FileStore)  
