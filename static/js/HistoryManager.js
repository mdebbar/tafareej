var onSwitch = null;

var HistoryManager = {
  getState() {
    return window.history.state || {};
  },

  push(state, title, url) {
    if (typeof title !== 'undefined') {
      document.title = title || '';
    }
    window.history.pushState.apply(window.history, arguments);
  },

  replace(state, title, url) {
    if (typeof title !== 'undefined') {
      document.title = title || '';
    }
    window.history.replaceState.apply(window.history, arguments);
  },

  onSwitch(callback) {
    onSwitch = callback;
  }
};

window.onpopstate = function(event) {
  event.state && onSwitch && onSwitch(event);
};

module.exports = HistoryManager;
