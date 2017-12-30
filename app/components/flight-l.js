import Component from '@ember/component';

export default Component.extend({
  expanded: false,
  rowHeight: '50px',
  actions: {
    updateFlight(propertyName, propertyValue) {
      this.get('onFlightChanged')(this.get('flight'), propertyName, propertyValue);
    },
    deleteFlight(flight) {
      this.get('onDeleteFlight')(this.get('flight'));
    },
    setExpanded(expanded) {
      this.set('expanded', expanded);
      this.set('rowHeight', expanded ? '100px' : '50px');
    }
  }
});
