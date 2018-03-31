import Component from '@ember/component';

export default Component.extend({
  didUpdateAttrs() {
    this._super(...arguments);
    if (this.get('locked')) {
      this.set('editable', false);
    }
  },
  actions: {
    setExpanded(expanded) {
      this.set('expanded', expanded);
      this.get('onExpand')(expanded);
    },
    setEditable(editable) {
      if (this.get('locked')) {
        this.set('editable', false)
        this.get('onEditable')(false);
      }
      else {
        this.set('editable', editable);
        this.get('onEditable')(editable);
      }
    },
    deleteFlight() {
      this.get('onDeleteFlight')();
    }
  }
});
