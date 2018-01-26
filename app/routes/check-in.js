import Ember from 'ember';
import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
  model(parameters) {
    return RSVP.hash({
      aircraft: this.get('store').query('aircraft', {
        filter: {
          callSign: parameters.call_sign
        }
      }).then(function(aircraft) {
        return aircraft.get('firstObject');
      }),
      location: new RSVP.Promise(function(resolve) {
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
