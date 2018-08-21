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

const validate = (find, obj) => {
  const keys = Object.keys(find)
  const len = keys.length
  for (let i = 0; i < len; i++) {
    const key = keys[i]
    if (key === '$or') {
      const objs = Object.keys(find[key])
      const len1 = objs.length
      for (let j = 0; j < len1; j++) {
        // If any one condition gets satisfied return true
        if (validate(objs[j], obj)) return true
      }
      // Return false if no condition is matched
      return false
    }
    // Return false if the obj does not contain the required field 
    if (!loadValue(obj, key).found) return false

    if (typeof find[key] !== 'object') return loadValue(find, key).value === loadValue(obj, key).value
    const subKeys = Object.keys(find[key])
    const len1 = subKeys.length
    for (let j = 0; j < len1; j++) {
      const subKey = subKeys[j]
      const val1 = loadValue(obj, key)
      const val2 = find[key][subKey]
      switch (subKey) {
        case '$eq':
          if (val1 !== val2) return false
          break
        case '$neq':
          if (val1 === val2) return false
          break
        case '$gt':
          if (val1 <= val2) return false
          break
        case '$gte':
          if (val1 < val2) return false
          break
        case '$lt':
          if (val1 >= val2) return false
          break
        case '$lte':
          if (val1 > val2) return false
          break
        case 'default':
          return false
      }
    }
  }
  return true
}

const loadValue = (state, key) => {
  const keys = key.split('.')
  let result = {
    found: false,
    value: undefined
  }
  let len = keys.length
  for (let i = 0; i < len; i++) {
    if (state === undefined || state === null || !isObject(state) || !state.hasOwnProperty(keys[i])) {
      break
    }
    if (i === len - 1) result = {
      found: true,
      value: state[keys[i]]
    }
    else state = state[keys[i]]
  }
  return result
}

const storeValue = (state, key, value) => {
  const keys = key.split('.')
  let ok = true
  let len = keys.length
  for (let i = 0; i < len; i++) {
    if (!state.hasOwnProperty(keys[i])) {
      ok = false
      break
    }
    if (i === len - 1) state[keys[i]] = value
    else state = state[keys[i]]
  }
  return ok
}

const isObject = value => {
  return value && typeof value === 'object' && value.constructor === Object;
}

exports.loadValue = loadValue
exports.storeValue = storeValue
exports.validate = validate