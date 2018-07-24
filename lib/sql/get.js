const sql = require('./sql');
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Get {
  constructor(appId, table, url, options, db) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'GET' });
    this.params = { tbl: table };
  }

  where(...conditions) {
    this.params.where = and(...conditions);
    return this;
  }

  select(...select) {
    this.params.sel = select
  }

  order(...orderBys) {
    this.params.order = orderBys;
  }

  offset(offset) {
    this.params.offset = offset;
  }

  limit(limit) {
    this.params.limit = limit
  }

  all() {
    let url = sql.sqlURL(this.url, this.db, this.appId, this.options.tbl, this.params);
    return fetchAsync(url, this.options);
  }
}

module.exports = Get;