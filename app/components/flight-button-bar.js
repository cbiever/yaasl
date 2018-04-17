import Component from '@ember/component';

export default Component.extend({
  actions: {
    setExpanded(expanded) {
      this.set('expanded', expanded);
      this.get('onExpand')(expanded);
    },
    setEditable(editable) {
      this.get('onEditable')(editable);
    },
    setLocked(locked) {
      this.get('onLock')(locked);
    },
    deleteFlight() {
      this.get('onDeleteFlight')();
    }
  }
});
