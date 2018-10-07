import Mixin from '@ember/object/mixin';
import Ember from 'ember';
import RSVP from 'rsvp';
import fetch from 'fetch';

export default Mixin.create({
  session: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  checkAuthenticated(transition) {
    return new RSVP.Promise((resolve, reject) => {
      let session = this.get('session');
      if (transition.intent.name != 'login') {
        session.set('transition', transition);
      }
      if (session.hasAuthorization()) {
        resolve();
      }
      else if (session.restoreAuthorization()) {
        this.get('messageBus').publish('loggedIn');
        resolve();
      }
      else {
        fetch('/api/v1/login', { method: 'post' })
          .then(response => {
            let authorization = response.headers.get('authorization');
            if (authorization) {
              session.setAuthorization(authorization);
              this.get('messageBus').publish('loggedIn');
              resolve();
            }
            else {
              reject();
            }
          })
          .catch((message) => {
            console.error('authorization: ', message);
            reject();
          });
      }
    });
  },
  handleAuthenticationError(error) {
    if (error && error.errors && error.errors.length > 0 && error.errors[0].status === '403') {
      let session = this.get('session');
      if (session.hasAuthorization()) {
        console.info('Tried with token from localStorage, but backend responded with 403. Redirecting to login.');
        session.clearAuthorization();
        this.replaceWith('login');
        return true;
      }
    }
    return false;
  }
});
