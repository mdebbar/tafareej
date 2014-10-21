function debounce(func, delay) {
  var timer;
  var debounced = function() {
    var that = this, args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      func.apply(that, args);
    }, delay);
  };
  debounced.cancel = function() {
    clearTimeout(timer);
  };
  return debounced;
}

module.exports = debounce;
