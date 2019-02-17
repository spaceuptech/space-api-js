## Classes

<dl>
<dt><a href="#Api">Api</a></dt>
<dd><p>Class representing the client api.</p>
</dd>
</dl>

## External

<dl>
<dt><a href="#external_Mongo">Mongo</a></dt>
<dd><p>The MongoDB Client Interface.</p>
</dd>
<dt><a href="#external_SQL">SQL</a></dt>
<dd><p>The SQL Client Interface.</p>
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
    * [.Mongo()](#Api+Mongo) ⇒ [<code>Mongo</code>](#external_Mongo)
    * [.Postgres()](#Api+Postgres) ⇒ [<code>SQL</code>](#external_SQL)
    * [.MySQL()](#Api+MySQL) ⇒ [<code>SQL</code>](#external_SQL)
    * [.call(engineName, funcName, params, [timeout])](#Api+call) ⇒ <code>Promise</code>

<a name="new_Api_new"></a>

### new Api(projectId, url)
Create an instance of the Client API.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| projectId | <code>string</code> |  | The Project Id. |
| url | <code>string</code> | <code>&quot;/&quot;</code> | Base url of space-exec server. |

**Example**  
```js
import { API } from 'space-api';

const api = new API('my-project', 'http://localhost:8080');
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

### api.Mongo() ⇒ [<code>Mongo</code>](#external_Mongo)
Returns a MongoDB client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>Mongo</code>](#external_Mongo) - MongoDB client instance  
<a name="Api+Postgres"></a>

### api.Postgres() ⇒ [<code>SQL</code>](#external_SQL)
Returns a SQL client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>SQL</code>](#external_SQL) - SQL client instance  
<a name="Api+MySQL"></a>

### api.MySQL() ⇒ [<code>SQL</code>](#external_SQL)
Returns a SQL client instance

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: [<code>SQL</code>](#external_SQL) - SQL client instance  
<a name="Api+call"></a>

### api.call(engineName, funcName, params, [timeout]) ⇒ <code>Promise</code>
Calls a function from Function as a Service Engine

**Kind**: instance method of [<code>Api</code>](#Api)  
**Returns**: <code>Promise</code> - Returns a promise  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| engineName | <code>string</code> |  | The name of engine with which the function is registered |
| funcName | <code>string</code> |  | The name of function to be called |
| params | <code>Object</code> |  | The params for the function |
| [timeout] | <code>string</code> | <code>5000</code> | Timeout in milliseconds |

**Example**  
```js
api.call('my-engine', 'my-func', { msg: 'Function as a Service is awesome!' }, 1000)
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
<a name="external_Mongo"></a>

## Mongo
The MongoDB Client Interface.

**Kind**: global external  
**See**: [https://github.com/spaceuptech/space-api-js/wiki/Mongo](https://github.com/spaceuptech/space-api-js/wiki/Mongo)  
<a name="external_SQL"></a>

## SQL
The SQL Client Interface.

**Kind**: global external  
**See**: [https://github.com/spaceuptech/space-api-js/wiki/SQL](https://github.com/spaceuptech/space-api-js/wiki/SQL)  
