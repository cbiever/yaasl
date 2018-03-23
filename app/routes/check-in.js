import Ember from 'ember';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import AuthenticationChecker from '../mixins/authentication-checker'

export default Route.extend(AuthenticationChecker, {
  store: Ember.inject.service(),
  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(() => {
      console.info('logged in check in');
    },
    () => {
      this.transitionTo('login');
    });
  },
  model(parameters) {
    return RSVP.hash({
      aircraft: this.get('store').query('aircraft', {
        filter: {
          callSign: parameters.call_sign
        }
      }).then(function(aircraft) {
        return aircraft.get('firstObject');
      }),
      location: new RSVP.Promise((resolve) => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(function(position) {
              resolve(position);
            },
            function(error) {
              console.log('no position: ', error);
              resolve(null);
            },
            { timeout:10000, enableHighAccuracy: true }
          );
        }
        else {
          resolve(null);
        }
      })
    });
  }
});
