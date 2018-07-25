const createURL = require('../utils').createURL;
const fetchAsync = require('../utils').fetchAsync;

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

  profile() {
    let url = createURL(`${this.url}v1/auth/${this.db}/profile`);
    return fetchAsync(url, Object.assign({}, this.options, { method: 'GET' }));
  }

  signIn(email, pass) {
    let db = this.db;
    let url = createURL(`${this.url}v1/auth/email/signin`);
    let body = JSON.stringify({ email, pass, db });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }

  signUp(email, name, pass, role) {
    let db = this.db;
    let url = createURL(`${this.url}v1/auth/email/signup`);
    let body = JSON.stringify({ email, pass, name, role, db });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }
}

const sqlURL = (prefix, db, appId, table, params = {}) => {
  let url = `${prefix}v1/sql/${db}/${appId}/${table}`;
  return createURL(url, params)
};

exports.sqlURL = sqlURL;
exports.SQL = SQL;