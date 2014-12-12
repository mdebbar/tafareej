function throttle(func, delay) {
  var timer;
  var throttled = function(...args) {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      func.apply(this, args);
    }, delay);
  };
  throttled.cancel = function() {
    clearTimeout(timer);
    timer = null;
  };
  return throttled;
}

module.exports = throttle;
