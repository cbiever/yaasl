import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default Route.extend({
  store: Ember.inject.service(),
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
      ktrax: new RSVP.Promise(function(resolve, reject) {
        Ember.$.get('/api/v1/rs/flights/ktrax', 'location=' + parameters.location_id + '&date=' + parameters.date_id )
          .then((response) => { console.log('response: ', response); resolve(response) })
          .catch((msg) => { console.log('error: ', msg); reject(msg) });
      })
    });
  },
  afterModel(model) {
    let session = this.get('store').peekRecord('session', 42);
    session.set('location', model.location);
    session.set('date', model.date);
  }
});
