const sql = require('./sql');
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Delete {
  constructor(appId, table, url, options, db) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'DELETE' });
    this.params = { tbl: table };
  }

  where(conditions) {
    this.params.find = sql.generateFind(conditions);
    this.params.type = conditions.type
    return this;
  }

  all() {
    this.options.body = JSON.stringify({ obj: this.params })
    let url = sql.sqlURL(this.url, this.db, this.appId, this.params.tbl);
    return fetchAsync(url, this.options);
  }
}

module.exports = Delete;