import BaseRoute from "./baseRoute";
import { inject as service } from '@ember-decorators/service';
import RSVP from 'rsvp';
import fetch from 'fetch';

export default class extends BaseRoute {

  @service session
  @service store
  @service messageBus

  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(
      () => console.info('logged in ktrax'),
      () => this.transitionTo('login'));
  }

  model(parameters) {
    return RSVP.hash({
      location: this.store.query('location', {
        filter: {
          location: parameters.location
        }
      }).then(locations => {
        return locations.firstObject;
      }),
      date: new Date(parameters.date),
      flights: new RSVP.Promise((resolve, reject) => {
        fetch('/api/v1/rs/flights/ktrax?location=' + parameters.location + '&date=' + parameters.date, {
          headers: { 'Authorization': this.session.authorization }
        })
        .then(response => resolve(response.json()))
        .catch(msg => { console.log('error: ', msg); reject(msg) });
      })
    });
  }

  afterModel(model) {
    this.messageBus.publish('location', model.location);
    this.messageBus.publish('date', model.date);
  }

}
