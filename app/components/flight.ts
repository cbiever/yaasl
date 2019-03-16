import Component from '@ember/component';
import { attribute } from "@ember-decorators/component";
import { action } from '@ember-decorators/object';
import Location from '../models/location';
import Pilot from '../models/pilot';
import PilotRole from "yaasl/models/pilot-role";
import Aircraft from "yaasl/models/aircraft";
import CostSharing from "yaasl/models/cost-sharing";

export default class Flight extends Component {

  @attribute flight?: Flight;
  @attribute location?: Location;
  @attribute locations? : Location[];
  @attribute pilot?: Pilot;
  @attribute PilotRoles?: PilotRole[];
  @attribute towPlanes?: Aircraft[];
  @attribute towPilots?: Pilot[];
  @attribute costSharings?: CostSharing[];
  @attribute today?: boolean;
  @attribute onFlightChanged: any;
  @attribute onDeleteFlight: any;

  comment: String = '';
  editable: boolean = false;
  expanded: boolean = false;
  locked: boolean = false;

  init() {
    super.init();
    if (this.flight) {
      this.comment = this.flight.comment;
      this.editable = this.flight.editable;
      this.locked = this.flight.locked;
    }
  }

  @action
  updateComment() {
    this.onFlightChanged(this.flight, 'comment', this.comment);

  }

  @action
  updateFlight(propertyName: string, propertyValue: string | number | Date) {
    this.onFlightChanged(this.flight, propertyName, propertyValue);
  }

  @action
  deleteFlight() {
    this.onDeleteFlight(this.flight);
  }

  @action
  setExpanded(expanded: boolean) {
    this.set('expanded', expanded);
  }

  @action
  setEditable(editable: boolean) {
    this.onFlightChanged(this.flight, 'editable', editable);
  }

  @action
  setLocked(locked: boolean) {
    this.onFlightChanged(this.flight, 'locked', locked);
  }

}
