var Dispatcher = require('flux').Dispatcher;
var Map = require('../util/Map');
var merge = require('../util/merge');
var PayloadSources = require('./PayloadSources');

class TafareejDispatcher extends Dispatcher {

  handleServerAction(action) {
    this.dispatch({
      source: PayloadSources.SERVER,
      action: action,
    });
  }

  handleViewAction(action) {
    this.dispatch({
      source: PayloadSources.VIEW,
      action: action,
    });
  }
}

module.exports = new TafareejDispatcher();
