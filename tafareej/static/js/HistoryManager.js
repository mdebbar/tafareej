(function(global) {

  var onSwitch = null;

  global.HistoryManager = {
    getState: function() {
      return window.history.state || {};
    },
    push: function(state, title, url) {
      if (typeof title !== 'undefined') {
        document.title = title || '';
      }
      window.history.pushState.apply(window.history, arguments);
    },
    replace: function(state, title, url) {
      if (typeof title !== 'undefined') {
        document.title = title || '';
      }
      window.history.replaceState.apply(window.history, arguments);
    },
    onSwitch: function(callback) {
      onSwitch = callback;
    }
  };

  window.onpopstate = function(event) {
    event.state && onSwitch && onSwitch(event);
  };

})(MODULES);
