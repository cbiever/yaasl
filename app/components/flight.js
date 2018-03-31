import Ember from 'ember';

export default Ember.Mixin.create({
  init() {
    this._super(...arguments);
    this.set('comment', this.get('flight').get('comment'));
    this.set('editable', this.get('flight').get('editable'));
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
    setEditable(editable) {
      let flight = this.get('flight');
      if (!flight.get('locked')) {
        this.set('editable', editable);
        flight.set('editable', editable);
        flight.save();
      }
      else {
        this.set('editable', false);
      }
    }
  }
});
