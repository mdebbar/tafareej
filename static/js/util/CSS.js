function normalizeCSSClass(klass) {
  if (Array.isArray(klass)) {
    return CSS.join.apply(CSS, klass);
  }
  if (typeof klass === 'object') {
    return CSS.join.apply(CSS, Object.keys(klass).filter(function (c) {
      return !!klass[c];
    }));
  }
  return String(klass) || '';
}

var CSS = {
  hasClass: function(element, className) {
    return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
  },
  join: function() {
    return Array.prototype.map.call(arguments, normalizeCSSClass).join(' ');
  },
  setStyle: function(element, styles) {
    Object.keys(styles).forEach(function(key) {
      element.style[key] = styles[key];
    });
  }
};

module.exports = CSS;
