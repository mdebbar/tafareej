/**
 * Merge the object b into a, and return a.
 */
function mergeInto(a, b) {
  for (var k in b) {
    if (b.hasOwnProperty(k)) {
      a[k] = b[k];
    }
  }
  return a;
}

module.exports = mergeInto;
