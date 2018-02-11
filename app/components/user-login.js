import Component from '@ember/component';

export default Component.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service(),
  router: Ember.inject.service(),
  messageBus: Ember.inject.service(),
  actions: {
    login() {
      Ember.$.post({
          url: '/api/v1/login',
          data: 'username=' + this.get('username') + '&password=' + this.get('password'),
          mimeType: "text"
        })
        .then((response, status, xhr) => {
          let session = this.get('session');
          session.set('authorization', xhr.getResponseHeader('Authorization'));
          this.get('messageBus').publish('loggedIn');
          let transition = session.get('transition');
          if (!transition || transition.name == 'login' || transition.intent.url == '/login') {
            let today = new Date();
            this.get('router').replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
          }
          else {
            transition.retry();
          }
          session.set('transition', null);
        })
        .catch((message) => { console.log('error: ', message); });
    }
  }
});
