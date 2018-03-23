import Mixin from '@ember/object/mixin';
import Ember from 'ember';
import RSVP from 'rsvp';

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
        Ember.$.post({
            url: '/api/v1/login'
          })
          .then((response, status, xhr) => {
            let authorization = xhr.getResponseHeader('Authorization');
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
    if (error.errors[0].status === '403') {
      let session = this.get('session');
      if (session.hasAuthorization()) {
        console.info('Tried with token from localStorage, but backend responded with 403. Redirecting to login.');
        session.clearAuthorization();
        this.replaceWith('login');
        return true;
      }
      else {
        return false;
      }
    }
  }
});
