import Component from '@ember/component';

export default Component.extend({
  expanded: false,
  locked: false,
  actions: {
    setExpanded(expanded) {
      this.set('expanded', expanded);
      this.get('onExpand')(expanded);
    },
    setLocked(locked) {
      this.set('locked', locked);
      this.set('onLock', locked);
    },
    deleteFlight() {
      this.get('onDeleteFlight')();
    }
  }
});
