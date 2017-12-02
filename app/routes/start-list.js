import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
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