import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import fetch from 'fetch';

export default Controller.extend({
  session: service(),
  store: service(),
  router: service(),
  messageBus: service(),
  canLogin: false,
  error: false,
  actions: {
    update() {
      this.set('canLogin', this.get('username') && this.get('password'));
      this.set('error', false);
    },
    login() {
      let formData = new FormData();
      formData.append('username', this.get('username'));
      formData.append('password', this.get('password'));
      formData.append('rememberMe', this.get('rememberMe'));
      fetch('/api/v1/login', {
         method: "post",
         body: formData
      }).then(response => {
          this.set('password', undefined);
          this.set('rememberMe', false);
          let session = this.get('session');
          session.setAuthorization(response.headers.get('authorization'));
          this.get('messageBus').publish('loggedIn');
          let transition = session.get('transition');
          if (!transition || (transition.intent.url && (transition.intent.url == '/' || transition.intent.url.startsWith('/log'))) || (transition.name && transition.name.startsWith('log'))) {
            let today = new Date();
            this.get('router').replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
          }
          else {
            transition.retry();
          }
          session.set('transition', undefined);
        })
        .catch((message) => {
           this.set('error', true);
           console.log('error: ', message);
        });
    }
  }
});
