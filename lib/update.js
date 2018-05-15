const utils = require('./utils'),
  fetchAsync = utils.fetchAsync,
  createURL = utils.createURL,
  and = utils.and;

class Update {
  constructor(appId, collection, url, options) {
    this.appId = appId;
    this.collection = collection;
    this.url = url;
    this.options = Object.assign({}, options, { method: 'POST' });
    this.params = { find: {}, update: {} };
  }

  where(...conditions) {
    this.params.find = and(...conditions);
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
    let url = createURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }

  all() {
    this.params.op = 'all';
    this.options.body = JSON.stringify(this.params);
    let url = createURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }

  upsert() {
    this.params.op = 'upsert';
    this.options.body = JSON.stringify(this.params);
    let url = createURL(this.url, this.appId, this.collection);
    return fetchAsync(url, this.options);
  }
}

module.exports = Update;