import Ember from 'ember';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import AuthenticationChecker from '../mixins/authentication-checker'

export default Route.extend(AuthenticationChecker, {
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(
      () => {
        console.info('logged in ktrax');
      },
      () => {
        this.transitionTo('login');
      }
    );
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
      flights: new RSVP.Promise((resolve, reject) => {
        Ember.$.get({
          url: '/api/v1/rs/flights/ktrax',
          data: 'location=' + parameters.location + '&date=' + parameters.date,
          beforeSend: (xhr) => {
            xhr.setRequestHeader('Authorization', this.get('session').get('authorization'));
          }
        })
        .then(response => resolve(response))
        .catch(msg => { console.log('error: ', msg); reject(msg) });
      })
    });
  },
  afterModel(model) {
    this.get('messageBus').publish('location', model.location);
    this.get('messageBus').publish('date', model.date);
  }
});
