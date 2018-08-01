(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const Api = require('./lib/api');
const utils = require('./lib/utils')

exports.API = Api;
exports.and = utils.and;
exports.or = utils.or;
exports.cond = utils.cond;
},{"./lib/api":2,"./lib/utils":13}],2:[function(require,module,exports){
const Mongo = require('./mongo/mongo').Mongo;
const SQL = require('./sql/sql').SQL;

class Api {
  constructor(appId, url = '/') {
    this.appId = appId;
    this.url = url;
    this.options = {
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    };
  }

  setToken(token) {
    this.options.headers.Authorization = 'Bearer ' + token;
  }

  setAppId(appId) {
    this.appId = appId;
  }

  Mongo() {
    return new Mongo(this.appId, this.url, this.options);
  }

  Postgres() {
    return new SQL(this.appId, this.url, this.options, 'postgres');
  }

  MySQL() {
    return new SQL(this.appId, this.url, this.options, 'mysql');
  }
}

module.exports = Api;
},{"./mongo/mongo":6,"./sql/sql":11}],3:[function(require,module,exports){
const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Delete {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'DELETE' });
    this.params = {};
  }

  where(...conditions) {
    this.params.find = mongo.generateFind(and(...conditions));
    return this;
  }

  one() {
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }

  many() {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }
}

module.exports = Delete;
},{"../utils":13,"./mongo":6}],4:[function(require,module,exports){
const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Get {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'GET' });
    this.params = {};
  }

  where(...conditions) {
    this.params.find = mongo.generateFind(and(...conditions));
    return this;
  }

  select(obj) {
    this.params.select = obj;
    return this;
  }

  sort(...array) {
    this.params.sort = array;
    return this;
  }

  skip(num) {
    this.params.skip = num;
    return this;
  }

  limit(num) {
    this.params.limit = num;
    return this;
  }

  one() {
    this.params.op = 'one';
    let url = mongo.mongoURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }

  all() {
    this.params.op = 'all';
    let url = mongo.mongoURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }

  count() {
    this.params.op = 'count';
    let url = mongo.mongoURL(this.url, this.appId, this.collection, this.params);
    return fetchAsync(url, this.options);
  }
}

module.exports = Get;
},{"../utils":13,"./mongo":6}],5:[function(require,module,exports){
const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync;
  
class Insert {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = {};
  }

  one(doc) {
    this.params.doc = doc;
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);    
  }

  many(docs) {
    this.params.doc = docs;
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);    
  }
}

module.exports = Insert;
},{"../utils":13,"./mongo":6}],6:[function(require,module,exports){
const Get = require('./get');
const Insert = require('./insert');
const Update = require('./update');
const Delete = require('./delete');

const createURL = require('../utils').createURL;
const fetchAsync = require('../utils').fetchAsync;

class Mongo {
  constructor(appId, url, options) {
    this.appId = appId
    this.url = url
    this.options = options
  }

  get(collection) {
    return new Get(this.appId, collection, this.url, this.options);
  }

  insert(collection) {
    return new Insert(this.appId, collection, this.url, this.options);
  }

  update(collection) {
    return new Update(this.appId, collection, this.url, this.options);
  }

  delete(collection) {
    return new Delete(this.appId, collection, this.url, this.options);
  }

  profile() {
    let url = createURL(`${this.url}v1/auth/profile`);
    return fetchAsync(url, Object.assign({}, this.options, { method: 'GET' }));
  }

  signIn(email, pass) {
    let url = createURL(`${this.url}v1/auth/email/signin`);
    let body = JSON.stringify({ email, pass });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }

  signUp(email, name, pass, role) {
    let url = createURL(`${this.url}v1/auth/email/signup`);
    let body = JSON.stringify({ email, pass, name, role });
    return fetchAsync(url, Object.assign({}, this.options, { method: 'POST', body: body }));
  }
}

const generateFind = (condition) => {
  switch (condition.type) {
    case 'and':
      return condition.clauses.reduce((prev, curr) => Object.assign({}, prev, generateFind(curr)), {})

    case 'or':
      newConds = condition.clauses.map(cond => generateFind(cond))
      return { '$or': newConds }

    case 'cond':
      switch (condition.op) {
        case '==':
          return { [condition.f1]: condition.f2 };
        case '>':
          return { [condition.f1]: { $gt: condition.f2 } };
        case '<':
          return { [condition.f1]: { $lt: condition.f2 } };
        case '>=':
          return { [condition.f1]: { $gte: condition.f2 } };
        case '<=':
          return { [condition.f1]: { $lte: condition.f2 } };
        case '!=':
          return { [condition.f1]: { $ne: condition.f2 } };
        case 'in':
          return { [condition.f1]: { $in: condition.f2 } };
        case 'notIn':
          return { [condition.f1]: { $nin: condition.f2 } };
      }

  }
}

exports.mongoURL = (prefix, appId, collection, params = {}) => {
  let url = `${prefix}v1/mongo/${appId}/${collection}`;
  return createURL(url, params)
};

exports.generateFind = generateFind
exports.Mongo = Mongo
},{"../utils":13,"./delete":3,"./get":4,"./insert":5,"./update":7}],7:[function(require,module,exports){
const mongo = require('./mongo')
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Update {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'PUT' });
    this.params = { find: {}, update: {} };
  }

  where(...conditions) {
    this.params.find = mongo.generateFind(and(...conditions));
    return this;
  }

  set(obj) {
    this.params.update.$set = obj;
    return this;
  }

  push(obj) {
    this.params.update.$push = obj;
    return this;
  }

  remove(fields) {
    this.params.update.$unset = fields.reduce((prev, curr) => Object.assign(prev, { [curr]: '' }), {});
    return this;
  }

  rename(obj) {
    this.params.update.$rename = obj;
    return this;
  }

  inc(obj) {
    this.params.update.$inc = obj;
    return this;
  }

  mul(obj) {
    this.params.update.$mul = obj;
    return this;
  }

  max(obj) {
    this.params.update.$max = obj;
    return this;
  }

  min(obj) {
    this.params.update.$min = obj;
    return this;
  }

  currentTimeStamp(...values) {
    this.params.update.$currentDate = Object.assign({}, this.state.currentDate, values.reduce((prev, curr) => {
      return Object.assign(prev, { curr: { $type: 'timestamp' } });
    }, {}));
    return this;
  }

  currentDate(...values) {
    this.params.update.$currentDate = Object.assign({}, this.state.currentDate, values.reduce((prev, curr) => {
      return Object.assign(prev, { curr: { $type: 'date' } });
    }, {}));
    return this;
  }

  one() {
    this.params.op = 'one';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }

  all() {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }

  upsert() {
    this.params.op = 'upsert';
    this.options.body = JSON.stringify(this.params);
    let url = mongo.mongoURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }
}

module.exports = Update;
},{"../utils":13,"./mongo":6}],8:[function(require,module,exports){
const sql = require('./sql');
const generateFind = require('../mongo/mongo').generateFind
const utils = require('../utils'),
  fetchAsync = utils.fetchAsync,
  and = utils.and;

class Delete {
  constructor(appId, table, url, options, db) {
    this.appId = appId;
    this.url = url;
    this.db = db;
    this.options = Object.assign({}, options, { method: 'DELETE' });
    this.table = table;
    this.params = {};
  }

  where(conditions) {
    this.params.find = generateFind(conditions);
    this.params.type = conditions.type
    return this;
  }

  all() {
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options);
  }
}

module.exports = Delete;
},{"../mongo/mongo":6,"../utils":13,"./sql":11}],9:[function(require,module,exports){
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
},{"../mongo/mongo":6,"../utils":13,"./sql":11}],10:[function(require,module,exports){
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
    this.params = {};
  }

  one(record) {
    this.params.op = 'one';
    this.params.record = record;    
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options)
  }
  
  many(...records) {
    this.params.op = 'all';
    this.params.record = records;    
    this.options.body = JSON.stringify(this.params)
    let url = sql.sqlURL(this.url, this.db, this.appId, this.table);
    return fetchAsync(url, this.options)
  }
}

module.exports = Insert;
},{"../utils":13,"./sql":11}],11:[function(require,module,exports){
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

const generateFind = (condition) => {
  switch (condition.type) {
    case 'cond':
      if (condition.op === "==") return { [condition.f1]: condition.f2 };
      return { [condition.f1]: { op: condition.op, val: condition.f2 } };
    case 'and':
      return condition.clauses.reduce((prev, curr) => Object.assign({}, prev, generateFind(curr)), {});
    case 'or':
      return condition.clauses;
  }
};

exports.generateFind = generateFind;
exports.sqlURL = sqlURL;
exports.SQL = SQL;
},{"../utils":13,"./delete":8,"./get":9,"./insert":10,"./update":12}],12:[function(require,module,exports){
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
},{"../mongo/mongo":6,"../utils":13,"./sql":11}],13:[function(require,module,exports){
// Fetch asynchronuosly
exports.fetchAsync = (url, options) => {
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(response => {
        const status = response.status;
        response.json().then(data => {
          resolve({ status: status, data: data });
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
  });
};

exports.createURL = (url, params = {}) => {
  url = new URL(url)
  Object.keys(params).forEach(key => {
    let value = params[key];
    let type = typeof value
    if (type == 'object')
      value = JSON.stringify(value);
    url.searchParams.append(key, value);
  });  
  return url;
};

exports.cond = (f1, op, f2) => {
  return { type: 'cond', f1: f1, op: op, f2: f2 };
};

exports.and = (...conditions) => {
  return { type: 'and', clauses: conditions };
};

exports.or = (...conditions) => {
  return { type: 'or', clauses: conditions };
};
},{}]},{},[1]);
