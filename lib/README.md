## Classes

<dl>
<dt><a href="#Api">Api</a></dt>
<dd><p>Class representing the client api.</p>
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
<a name="Api+FileStore"></a>

### api.FileStore() ⇒ [<code>FileStore</code>](#external_FileStore)
Returns a FileStore client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>FileStore</code>](#external_FileStore) - FileStore client instance  
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
