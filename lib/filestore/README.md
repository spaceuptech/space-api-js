<a name="FileStore"></a>

## FileStore
**Kind**: global class  

* [FileStore](#FileStore)
    * [new FileStore(appId, url, options)](#new_FileStore_new)
    * [.uploadFile(path, file)](#FileStore+uploadFile) ⇒ <code>Promise</code>
    * [.createFolder(path, name)](#FileStore+createFolder) ⇒ <code>Promise</code>
    * [.listFiles(path)](#FileStore+listFiles) ⇒ <code>Promise</code>
    * [.delete(path)](#FileStore+delete) ⇒ <code>Promise</code>

<a name="new_FileStore_new"></a>

### new FileStore(appId, url, options)
Create an instance of the FileStore Interface.


| Param | Type |
| --- | --- |
| appId | <code>string</code> | 
| url | <code>string</code> | 
| options | <code>Object</code> | 

<a name="FileStore+uploadFile"></a>

### fileStore.uploadFile(path, file) ⇒ <code>Promise</code>
Uploads the given file at given path.

**Kind**: instance method of [<code>FileStore</code>](#FileStore)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| file | <code>file</code> | 

**Example**  
```js
const fileInput = document.querySelector('#your-file-input');
api.FileStore().uploadFile("/some-path", fileInput.files[0]).then(res => {
  if (res.status === 200) {
    console.log("File uploaded successfully");
  }
})
```
<a name="FileStore+createFolder"></a>

### fileStore.createFolder(path, name) ⇒ <code>Promise</code>
Creates a folder with given name at given path.

**Kind**: instance method of [<code>FileStore</code>](#FileStore)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 
| name | <code>string</code> | 

**Example**  
```js
api.FileStore().createFolder("/some-path", "my-folder").then(res => {
  if (res.status === 200) {
    console.log("Folder created successfully");
  }
})
```
<a name="FileStore+listFiles"></a>

### fileStore.listFiles(path) ⇒ <code>Promise</code>
Returns list of files within a directory.

**Kind**: instance method of [<code>FileStore</code>](#FileStore)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

**Example**  
```js
api.FileStore().listFiles("/some-path").then(res => ...)
```
<a name="FileStore+delete"></a>

### fileStore.delete(path) ⇒ <code>Promise</code>
Deletes a file / folder at given path.

**Kind**: instance method of [<code>FileStore</code>](#FileStore)  
**Returns**: <code>Promise</code> - Returns a promise containing response from server.  

| Param | Type |
| --- | --- |
| path | <code>string</code> | 

**Example**  
```js
api.FileStore().delete("/some-path").then(res => {
  if (res.status === 200) {
    console.log("Deleted successfully");
  }
})
```
