const sql = require('./sql');
const generateFind = require('../mongo/mongo').generateFind
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Update {
  constructor(appId, table, url, options, db) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'PUT' });
    this.table = table;
    this.params = {};
  }

  where(conditions) {
    this.params.find = generateFind(conditions);
    this.params.type = conditions.type
    return this;
  }

  all(record) {
    this.params.record = record
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options);
  }
}

module.exports = Update;