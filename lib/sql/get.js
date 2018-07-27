const sql = require('./sql');
const generateFind = require('../mongo/mongo').generateFind
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Get {
  constructor(appId, table, url, options, db) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'GET' });
    this.table = table;
    this.params = {};
  }

  where(conditions) {
    this.params.find = generateFind(conditions);
    this.params.type = conditions.type
    return this;
  }

  select(...select) {
    this.params.select = select
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
    this.params.op = 'one';
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table, this.params);
    return fetchAsync(url, this.options);
  }

  all() {
    this.params.op = 'all';
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table, this.params);
    return fetchAsync(url, this.options);
  }
}

module.exports = Get;