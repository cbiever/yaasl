import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  towplanes: Ember.computed(function() {
    return this.get('aircraft').filterBy('canTow', true);
  }),
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
  beforeModel() {
    // remove all flights, unloadAll('flight') is asynchronous and can unfortunately not be used here
    let flights = this.get('store').peekAll('flight').toArray();
    for (let i = 0; i < flights.length; i++) {
      flights.get(i).unloadRecord();
    }
  },
  model(parameters) {
    return RSVP.hash({
        location: this.get('store').query('location', {
          filter: {
            location: parameters.location_id
          }
        }).then(function(locations) {
          return locations.get('firstObject');
        }),
        date: new Date(parameters.date_id),
        aircraft: this.get('store').peekAll('aircraft'),
        pilots: this.get('store').peekAll('pilot'),
        flights: this.get('store').query('flight', {
          filter: {
            location: parameters.location_id,
            date: parameters.date_id
          }
        })
    });
  },
  afterModel(model) {
    let session = this.get('store').peekRecord('session', 42);
    session.set('location', model.location);
    session.set('date', model.date);
    model.flights.notifyPropertyChange();
  }
});
