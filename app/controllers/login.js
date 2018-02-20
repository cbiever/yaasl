import Ember from 'ember';
import Controller from '@ember/controller';
import jwtDecode from 'ember-cli-jwt-decode';

export default Controller.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  router: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  canLogin: false,
  error: false,
  actions: {
    update() {
      this.set('canLogin', this.get('username') && this.get('password'));
      this.set('error', false);
    },
    login() {
      Ember.$.post({
          url: '/api/v1/login',
          data: 'username=' + this.get('username') + '&password=' + this.get('password'),
          mimeType: "text"
        })
        .then((response, status, xhr) => {
          this.set('password', undefined);
          let session = this.get('session');
          session.set('authorization', xhr.getResponseHeader('Authorization'));
          this.get('messageBus').publish('loggedIn');
          let transition = session.get('transition');
          if (!transition || transition.intent.url == '/' || transition.name == 'login' || transition.intent.url == '/login') {
            let today = new Date();
            this.get('router').replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
          }
          else {
            transition.retry();
          }
          session.set('transition', undefined);
console.log('token: ', session.get('authorization'));
console.log('jwt: ', jwtDecode(session.get('authorization')));
        })
        .catch((message) => {
           console.log('error: ', message);
           this.set('error', true);
        });
    }
  }
});
