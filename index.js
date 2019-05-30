const utils = require('./lib/utils');
const API = require('./lib/api');

exports.API = API;
exports.and = utils.and;
exports.or = utils.or;
exports.cond = utils.cond;