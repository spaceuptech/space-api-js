const createURL = require('../utils').createURL;
const Get = require('./get');
const Insert = require('./insert');
const Update = require('./update');
const Delete = require('./delete');

class SQL {
  constructor(appId, url, options, db) {
    this.appId = appId
    this.url = url
    this.options = options
    this.db = db
  }

  get(table) {
    return new Get(this.appId, table, this.url, this.options, this.db);
  }

  insert(table) {
    return new Insert(this.appId, table, this.url, this.options, this.db);
  }

  update(table) {
    return new Update(this.appId, table, this.url, this.options, this.db);
  }

  delete(table) {
    return new Delete(this.appId, table, this.url, this.options, this.db);
  }
}

const sqlURL = (prefix, db, appId, table, params = {}) => {
  let url = `${prefix}v1/sql/${db}/${appId}/${table}`;
  return createURL(url, params)
};

exports.sqlURL = sqlURL;
exports.SQL = SQL;