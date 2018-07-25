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

  where(conditions) {
    this.params.find = sql.generateFind(conditions);
    this.params.type = conditions.type
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

  one() {
    let url = sql.sqlURL(this.url, this.db, this.appId, this.params.tbl, { op: 'one', obj: this.params });
    return fetchAsync(url, this.options);
  }

  all() {
    let url = sql.sqlURL(this.url, this.db, this.appId, this.params.tbl, { op: 'all', obj: this.params });
    return fetchAsync(url, this.options);
  }
}

module.exports = Get;