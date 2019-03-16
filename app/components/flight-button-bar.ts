import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class FlightButtonBar extends Component {

  expanded: boolean = false;
  onExpand: any;
  onEditable: any;
  onLock: any;
  onDeleteFlight: any;

  @action
  setExpanded(expanded: boolean) {
    this.set('expanded', expanded);
    this.onExpand(expanded);
  }

  @action
  setEditable(editable: boolean) {
    this.onEditable(editable);
  }

  @action
  setLocked(locked: boolean) {
    this.onLock(locked);
  }

  @action
  deleteFlight() {
    this.onDeleteFlight();
  }

}
