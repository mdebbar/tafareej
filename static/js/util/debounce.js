function debounce(func, delay) {
  var timer;
  var debounced = function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
  debounced.cancel = function() {
    clearTimeout(timer);
  };
  return debounced;
}

module.exports = debounce;
