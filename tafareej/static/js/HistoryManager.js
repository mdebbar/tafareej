(function(global) {

  global.HistoryManager = function(initialState, initialTitle, initialURL) {
    console.log(history);
    initialState && history.replaceState(initialState, initialTitle, initialURL);
    window.onpopstate = this._popStateListener.bind(this);
  };

  global.HistoryManager.prototype = {
    push: function(state, title, url) {
      document.title = title;
      history.pushState.apply(history, arguments);
    },
    onSwitch: function(callback) {
      this._onSwitch = callback;
    },
    _popStateListener: function(event) {
      event.state && this._onSwitch && this._onSwitch(event);
    }
  };

})(this);
