const Api = require('./lib/api');
const utils = require('./lib/utils')

exports.API = Api;
exports.and = utils.and;
exports.or = utils.or;
exports.cond = utils.cond;