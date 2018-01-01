import Component from '@ember/component';

export default Component.extend({
  expanded: false,
  actions: {
    updateFlight(propertyName, propertyValue) {
      this.get('onFlightChanged')(this.get('flight'), propertyName, propertyValue);
    },
    deleteFlight(flight) {
      this.get('onDeleteFlight')(this.get('flight'));
    },
    setExpanded(expanded) {
      this.set('expanded', expanded);
    }
  }
});
