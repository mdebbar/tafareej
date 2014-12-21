module.exports = {
  componentDidMount() {
    if (typeof this.getSubscriptions !== 'function') {
      throw new Error('If you use the Subscriptions mixin, you have to define getSubscriptions()');
    }
    this._subscriptions = this.getSubscriptions();
  },

  componentWillUnmount() {
    this._subscriptions.forEach(sub => sub.release());
  },
};
