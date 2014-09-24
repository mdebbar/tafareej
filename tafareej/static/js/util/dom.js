(function(global) {

  global.DOM = {

  };

  global.CSS = {
    hasClass: function(element, className) {
      return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
    },
    setStyle: function(element, styles) {
      Object.keys(styles).forEach(function(key) {
        element.style[key] = styles[key];
      });
    }
  };

})(this);
