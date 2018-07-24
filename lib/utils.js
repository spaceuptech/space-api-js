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

exports.createURL = (url, params = {}) => {
  let url = new URL(url);
  Object.keys(params).forEach(key => {
    let value = params[key];
    if (typeof value === 'object')
      value = JSON.stringify(value);
    url.searchParams.append(key, params[key]);
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