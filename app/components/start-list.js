import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  i18n: Ember.inject.service(),
  flights: undefined,
  sortedFlights: Ember.computed.sort('flights', function(flight1, flight2) {
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
  }),
  actions: {
    updateFlight(propertyName, flight, propertyValue) {
      flight.set(propertyName, propertyValue);
      flight.save();
      this.notifyPropertyChange('flights');
    },
    addFlight() {
      let flight = {};
      this.get('store').createRecord('flight', flight).save();
    },
    deleteFlight(flight) {
      flight.destroyRecord();
    },
    setLocale(locale) {
      this.set('i18n.locale', locale);
    }
  }
});
