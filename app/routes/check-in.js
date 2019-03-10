import BaseRoute from "./baseRoute";
import { inject as service } from '@ember-decorators/service';
import RSVP from 'rsvp';

export default class extends BaseRoute {

  @service store

  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(
      () => console.info('logged in check in'),
      () => this.transitionTo('login'));
  }

  model(parameters) {
    return RSVP.hash({
      aircraft: this.get('store').query('aircraft', {
        filter: {
          callSign: parameters.call_sign
        }
      }).then(function(aircraft) {
        return aircraft.get('firstObject');
      }),
      location: new RSVP.Promise(resolve => {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            position => {
              resolve(position);
            },
            error => {
              console.log('no position: ', error);
              resolve(null);
            },
            {
               timeout:10000,
               enableHighAccuracy: true
            }
          );
        }
        else {
          resolve(null);
        }
      })
    });
  }

}
