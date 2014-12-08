function normalizeCSSClass(klass) {
  if (typeof klass === 'object') {
    var list = Array.isArray(klass)
      ? klass
      : Object.keys(klass).filter(c => !!klass[c]);
    return list.map(normalizeCSSClass).join(' ');
  }
  return String(klass) || '';
}

var CSS = {
  hasClass(element, className) {
    return (` ${element.className} `).indexOf(` ${className} `) > -1;
  },

  join(...classes) {
    return normalizeCSSClass(classes);
  },

  setStyle(element, styles) {
    Object.keys(styles).forEach(function(key) {
      element.style[key] = styles[key];
    });
  },
};

module.exports = CSS;
