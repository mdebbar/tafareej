(function(global) {

  global.HistoryManager = function(initialState, initialTitle, initialURL) {
    initialState && history.replaceState(initialState, initialTitle, initialURL);
    window.onpopstate = this._popStateListener.bind(this);
  };

  global.HistoryManager.prototype = {
    push: function(state, title, url) {
      if (typeof title !== 'undefined') {
        document.title = title;
      }
      history.pushState.apply(history, arguments);
    },
    replace: function(state, title, url) {
      if (typeof title !== 'undefined') {
        document.title = title;
      }
      history.replaceState.apply(history, arguments);
    },
    onSwitch: function(callback) {
      this._onSwitch = callback;
    },
    _popStateListener: function(event) {
      event.state && this._onSwitch && this._onSwitch(event);
    }
  };

})(this);
