const sql = require('./sql');
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Insert {
  constructor(appId, table, url, options, db) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.table = table;
  }

  one(record) {
    this.params.op = 'one';
    this.params.insert = record;    
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options)
  }
  
  many(records) {
    this.params.op = 'all';
    this.params.insert = records;    
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options)
  }
}

module.exports = Insert;