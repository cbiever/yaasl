export default Ember.Mixin.create({
  expanded: false,
  locked: false,
  didReceiveAttrs() {
    this._super(...arguments);
    this.set('comment', this.get('flight').get('comment'));
  },
  actions: {
    updateComment() {
      this.get('onFlightChanged')(this.get('flight'), 'comment', this.get('comment'));
    },
    updateFlight(propertyName, propertyValue) {
      this.get('onFlightChanged')(this.get('flight'), propertyName, propertyValue);
    },
    deleteFlight() {
      this.get('onDeleteFlight')(this.get('flight'));
    },
    setExpanded(expanded) {
      this.set('expanded', expanded);
    },
    setLocked(locked) {
      this.set('locked', locked);
    }
  }
});
