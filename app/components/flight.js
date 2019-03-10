import Component from '@ember/component';
import { action } from '@ember-decorators/object';

export default class extends Component {

  init() {
    super.init(...arguments);
    this.set('comment', this.flight.comment);
    this.set('editable', this.flight.editable);
    this.set('locked', this.flight.locked);
  }

  @action
  updateComment() {
    this.onFlightChanged(this.flight, 'comment', this.comment);
  }

  @action
  updateFlight(propertyName, propertyValue) {
    this.onFlightChanged(this.flight, propertyName, propertyValue);
  }

  @action
  deleteFlight() {
    this.onDeleteFlight(this.flight);
  }

  @action
  setExpanded(expanded) {
    this.set('expanded', expanded);
  }

  @action
  setEditable(editable) {
    this.onFlightChanged(this.flight, 'editable', editable);
  }

  @action
  setLocked(locked) {
    this.onFlightChanged(this.flight, 'locked', locked);
  }

}
