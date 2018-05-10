import Ember from 'ember';
import Controller from '@ember/controller';
import ErrorHandler from '../mixins/error-handler';

export default Controller.extend(ErrorHandler, {
  store: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  i18n: Ember.inject.service(),
  towPlanes: Ember.computed(function() {
    return this.get('model').aircraft.filterBy('canTow', true);
  }),
  towPilots: Ember.computed(function() {
    return this.get('model').pilots.filterBy('canTow', true);
  }),
  sortedFlights: Ember.computed('model.flights.@each.startTime', function() {
    return this.get('model').flights.sort(function(flight1, flight2) {
      let startTime1 = flight1.get('startTime');
      let startTime2 = flight2.get('startTime');
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
  }),
  locked: Ember.computed('model.flights.@each.locked', function() {
    let locked = !this.get('today');
    if (!locked) {
      locked = this.get('model').flights.length > 0 && (this.get('model').flights.length == this.get('model').flights.filterBy('locked', true).length);
    }
    return locked;
  }),
  init() {
    this._super(...arguments);
    this.get('messageBus').subscribe('date', this, this.updateDate);
    this.get('messageBus').subscribe('add', this, this.addFlight);
    this.get('messageBus').subscribe('delete', this, this.deleteFlight);
  },
  updateDate(date) {
    let now = new Date();
    this.set('today', date.getDate() == now.getDate() && date.getMonth() == now.getMonth() && date.getFullYear() == now.getFullYear());
  },
  addFlight(flight) {
    if (flight.belongsTo('startLocation').value() == this.get('model').location) {
      this.get('model').flights.addObject(flight);
    }
    else {
      console.log('flight of different location ignored: ', flight.belongsTo('startLocation').value().get('name'), this.get('model').location.get('name'));
    }
  },
  deleteFlight(flight) {
    this.get('model').flights.removeObject(flight);
  },
  actions: {
    addFlight() {
      let flight = this.get('store').createRecord('flight', { 'startLocation': this.get('model').location, 'editable': true });
      flight.save().then(flight => {
        this.addFlight(flight);
      });
    },
    updateFlight(flight, propertyName, propertyValue) {
      flight.set(propertyName, propertyValue);
      if (propertyName == 'pilot1') {
        if (!flight.belongsTo('pilot1Role').value() && propertyValue.belongsTo('standardRole').value()) {
          flight.set('pilot1Role', propertyValue.get('standardRole'));
        }
      }
      else if (propertyName == 'pilot2') {
        if (!flight.belongsTo('pilot2Role').value() && propertyValue.belongsTo('standardRole').value()) {
          flight.set('pilot2Role', propertyValue.get('standardRole'));
        }
      }
      flight.save()
        .then((flight) => {
          if (flight.get('revision') <= 0) {
            flight.set('revision', -flight.get('revision'));
            this.set('errorMessage', this.get('i18n').t('error.revision'))
            this.set('showError', true);
          }
        })
        .catch(error => {
          this.handleError(error);
        });
    },
    deleteFlight(flight) {
      flight.destroyRecord()
        .then(() => {
          this.deleteFlight(flight);
        })
        .catch(error => {
          this.handleError(error)
        });
    },
    lockAllFlights() {
      this.get('model').flights.forEach(flight => {
        if (!flight.get('locked')) {
          flight.set('locked', true);
          flight.save().catch(error => this.handleError(error));
        }
      });
    },
    closeError() {
      this.set('showError', false);
    }
  }
});
