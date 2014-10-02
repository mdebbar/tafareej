(function(global) {

  var onSwitch = null;

  global.HistoryManager = {
    getState: function() {
      return global.history.state || {};
    },
    push: function(state, title, url) {
      if (typeof title !== 'undefined') {
        document.title = title || '';
      }
      global.history.pushState.apply(global.history, arguments);
    },
    replace: function(state, title, url) {
      if (typeof title !== 'undefined') {
        document.title = title || '';
      }
      global.history.replaceState.apply(global.history, arguments);
    },
    onSwitch: function(callback) {
      onSwitch = callback;
    }
  };


  window.onpopstate = function(event) {
    event.state && onSwitch && onSwitch(event);
  };

})(this);
