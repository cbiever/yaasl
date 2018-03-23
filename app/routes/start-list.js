import Ember from 'ember';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import AuthenticationChecker from '../mixins/authentication-checker'

export default Route.extend(AuthenticationChecker, {
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(() => {
      console.info('logged in start list');
      // remove all flights, unloadAll('flight') is asynchronous and can unfortunately not be used here
      let flights = this.get('store').peekAll('flight').toArray();
      for (let i = 0; i < flights.length; i++) {
        flights.get(i).unloadRecord();
      }
    },
    () => {
      this.transitionTo('login');
    });
  },
  model(parameters) {
    return RSVP.hash({
        location: this.get('store').query('location', {
          filter: {
            location: parameters.location
          }
        }).then(function(locations) {
          return locations.get('firstObject');
        }),
        date: new Date(parameters.date),
        aircraft: this.get('store').peekAll('aircraft'),
        locations: this.get('store').peekAll('location'),
        pilots: this.get('store').peekAll('pilot'),
        pilotRoles: this.get('store').peekAll('pilotRole'),
        flights: this.get('store').query('flight', {
          filter: {
            location: parameters.location,
            date: parameters.date
          }
        }).then(function(flights) {
          return flights.toArray();
        }),
        costSharings: this.get('store').peekAll('costSharing')
    });
  },
  afterModel(model) {
    this.get('messageBus').publish('location', model.location);
    this.get('messageBus').publish('date', model.date);
  }
});
