import Ember from 'ember';

export default Ember.Component.extend({
  store: Ember.inject.service(),
  flights: Ember.computed(function() {
    return this.get('store').peekAll('flight');
  }),
  filteredFlights: function() {
    let locationName = this.get('location').get('name');
    let date = this.get('date');
    let today = new Date();
    return this.get('flights').filterBy('location.name', locationName).filter(function(flight) {
      let startTime = flight.get('startTime');
      if (!startTime) {
        return date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDay() == today.getDay();
      }
      else {
        return startTime.getFullYear() == date.getFullYear() && startTime.getMonth() == date.getMonth() && startTime.getDay() == date.getDay();
      }
    });
  }.property('flights.@each'),
  sortedFlights: Ember.computed.sort('filteredFlights', function(flight1, flight2) {
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
      let flight = this.get('store').createRecord('flight', {});
      flight.set('location', this.get('location'));
      flight.save();
    },
    deleteFlight(flight) {
      flight.destroyRecord();
    },
  }
});
