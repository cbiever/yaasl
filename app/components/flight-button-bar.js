import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class extends Component {

  @action
  setExpanded(expanded) {
    this.set('expanded', expanded);
    this.get('onExpand')(expanded);
  }

  @action
  setEditable(editable) {
    this.get('onEditable')(editable);
  }

  @action
  setLocked(locked) {
    this.get('onLock')(locked);
  }

  @action
  deleteFlight() {
    this.get('onDeleteFlight')();
  }

}
