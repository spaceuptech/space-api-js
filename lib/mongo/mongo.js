const Get = require('./get');
const Insert = require('./insert');
const Update = require('./update');
const Delete = require('./delete');
const createURL = require('../utils').createURL;

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
}

const generateFind = (condtion) => {
  switch (condtion.type) {
    case 'and':
      return condition.clauses.reduce((prev, curr) => Object.assign({}, prev, generateFind(curr)), {})

    case 'or':
      newConds = condtion.clauses.map(cond => generateFind(cond))
      return { '$or': newConds }

    case 'cond':
      switch (condtion.op) {
        case "==":
          return { [f1]: f2 };
        case ">":
          return { [f1]: { $gt: f2 } };
        case "<":
          return { [f1]: { $lt: f2 } };
        case ">=":
          return { [f1]: { $gte: f2 } };
        case "<=":
          return { [f1]: { $lte: f2 } };
        case "!=":
          return { [f1]: { $ne: f2 } };
      }

  }
}

exports.mongoURL = (prefix, appId, collection, params = {}) => {
  let url = `${prefix}v1/mongo/${appId}/${collection}`;
  return createURL(url, params)
};

exports.generateFind = generateFind
exports.Mongo = Mongo