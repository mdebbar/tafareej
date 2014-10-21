var mergeInto = require('./mergeInto');

function merge(a, b) {
  return mergeInto(mergeInto({}, a), b);
}

module.exports = merge;
