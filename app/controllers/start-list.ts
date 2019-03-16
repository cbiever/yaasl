import BaseController from './baseController';
import { inject as service } from '@ember-decorators/service';
import { computed } from '@ember-decorators/object';
import { action } from '@ember-decorators/object';
import fetch from 'fetch';
import DS from "ember-data";
import Session from "../services/session";
import Flight from "../models/flight";
import Location from "../models/location";

export default class extends BaseController {

  today: boolean = false;

  @service session!: Session;
  @service store!: DS.Store;
  @service messageBus: any;
  @service intl: any;

  init() {
    super.init();
    this.messageBus.subscribe('date', this, this.updateDateListener);
    this.messageBus.subscribe('add', this, this.addFlightListener);
    this.messageBus.subscribe('delete', this, this.deleteFlightListener);
  }

  @computed
  get towPlanes() {
    return this.model.aircraft.filterBy('canTow', true);
  }

  @computed
  get towPilots() {
    return this.model.pilots.filterBy('canTow', true);
  }

  @computed('model.flights.@each.startTime')
  get sortedFlights() {
    return this.model.flights.sort((flight1: Flight, flight2: Flight) => {
      let startTime1 = flight1.startTime;
      let startTime2 = flight2.startTime;
      if (startTime1 && !startTime2) {
        return -1;
      }
      else if (startTime2 && !startTime1) {
        return 1;
      }
      else {
        if (startTime1 < startTime2) {
          return -1;
        }
        else if (startTime1 > startTime2) {
          return 1;
        }
        else {
          return 0;
        }
      }
    });
  }

  @computed('model.flights.@each.locked')
  get locked() {
    let locked = !this.today;
    if (!locked) {
      locked = this.model.flights.length > 0 && (this.model.flights.length == this.model.flights.filterBy('locked', true).length);
    }
    return locked;
  }

  updateDateListener(date: Date) {
    let now = new Date();
    this.set('today', date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear());
  }

  addFlightListener(flight: Flight) {
    if (flight.belongsTo('startLocation').value() == this.model.location || flight.belongsTo('landingLocation').value() == this.model.location) {
      this.model.flights.addObject(flight);
    }
    else {
      console.log('flight of different location ignored: ', (flight.belongsTo('startLocation').value() as Location).icao, this.model.location.icao);
    }
  }

  deleteFlightListener(flight: Flight) {
    this.model.flights.removeObject(flight);
  }

  @action
  addFlight() {
    let flight = this.store.createRecord('flight', { 'startLocation': this.model.location, 'editable': true });
    flight.save().then((flight: Flight) => this.addFlightListener(flight));
  }

  @action
  updateFlight(flight: any, propertyName: string, propertyValue: any) {
    flight.set(propertyName, propertyValue);
    if (propertyName == 'pilot1') {
      if (!flight.belongsTo('pilot1Role').value() && propertyValue.belongsTo('standardRole').value()) {
        flight.set('pilot1Role', propertyValue.standardRole);
      }
    }
    else if (propertyName == 'pilot2') {
      if (!flight.belongsTo('pilot2Role').value() && propertyValue.belongsTo('standardRole').value()) {
        flight.set('pilot2Role', propertyValue.standardRole);
      }
    }
    flight.save()
      .then((flight: Flight) => {
        if (flight.get('revision') <= 0) {
          flight.set('revision', -flight.get('revision'));
          this.set('errorMessage', this.intl.t('error.revision'))
          this.set('showError', true);
        }
        flight.notifyPropertyChange(propertyName); // not clear why this is needed, but sortedFlights doesn't get recalculated otherwise
      })
      .catch((error: any) => this.handleError(error));
  }

  @action
  deleteFlight(flight: Flight) {
    flight.destroyRecord()
      .then(() => this.deleteFlightListener(flight))
      .catch((error: any) => this.handleError(error));
  }

  @action
  lockAllFlights() {
    fetch('/api/v1/rs/flights/lock?location=' + this.model.location.icao, {
      method: 'post',
      headers: { 'Authorization': this.session.authorization }
    }).then(() => console.log('flights succesfully locked'))
      .catch((error: any) => this.handleError(error));
  }

  @action
  closeError() {
    this.set('showError', false);
  }

}
