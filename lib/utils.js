// Fetch asynchronuosly
exports.fetchAsync = (url, options) => {
  console.log('Sending:', options.body, 'to', url);
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(response => {
        const status = response.status;
        response.json().then(data => {
          console.log('Received:', data.result);
          resolve({ status: status, data: data.result });
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
  });
};

exports.createURL = (prefix, appId, collection, params = {}) => {
  let url = new URL(`${prefix}v1/col/${appId}/${collection}`);
  Object.keys(params).forEach(key => {
    let value = params[key];
    if (typeof value === 'object')
      value = JSON.stringify(value);
    url.searchParams.append(key, params[key]);
  });
  return url;
};

exports.and = (...conditions) => {
  return conditions.reduce((prev, curr) => Object.assign({}, prev, curr), {});
};

exports.or = (...conditions) => {
  return { $or: conditions };
};

exports.cond = (field, operator, value) => {
  switch (operator) {
    case "==":
      return { [field]: value };
    case ">":
      return { [field]: { $gt: value } };
    case "<":
      return { [field]: { $lt: value } };
    case ">=":
      return { [field]: { $gte: value } };
    case "<=":
      return { [field]: { $lte: value } };
    case "!=":
      return { [field]: { $ne: value } };
  }
};