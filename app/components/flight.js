import Ember from 'ember';

export default Ember.Mixin.create({
  expanded: false,
  locked: false,
  init() {
    this._super(...arguments);
    this.set('comment', this.get('flight').get('comment'));
    this.set('locked', this.get('flight').get('locked'));
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
