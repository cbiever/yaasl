import Controller from '@ember/controller';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import fetch from 'fetch';

export default class extends Controller {

  @service session
  @service store
  @service router
  @service messageBus

  canLogin = false
  error = false

  @action
  update() {
    this.set('canLogin', this.username && this.password);
    this.set('error', false);
  }

  @action
  login() {
    let formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('rememberMe', this.rememberMe);
    fetch('/api/v1/login', {
      method: "post",
      body: formData
    }).then(response => {
      if (response.ok) {
        this.set('password', undefined);
        this.set('rememberMe', false);
        this.session.setAuthorization(response.headers.get('authorization'));
        this.messageBus.publish('loggedIn');
        let transition = this.session.transition;
        if (!transition || (transition.intent.url && (transition.intent.url == '/' || transition.intent.url.startsWith('/log'))) || (transition.name && transition.name.startsWith('log'))) {
          let today = new Date();
          this.router.replaceWith('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
        } else {
          transition.retry();
        }
        this.session.set('transition', undefined);
      }
      else {
        this.set('error', true);
        console.log('error: ', response.status);
      }
    })
    .catch((message) => {
      this.set('error', true);
      console.log('error: ', message);
    });
  }

}
