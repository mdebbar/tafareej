function throttle(func, delay) {
  var timer, that, args;
  var throttled = function() {
    that = this;
    args = arguments;
    if (timer) return;
    timer = setTimeout(function() {
      timer = null;
      func.apply(that, args);
    }, delay);
  };
  throttled.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };
  return throttled;
}

module.exports = throttle;
