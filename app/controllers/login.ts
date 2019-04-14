import Controller from '@ember/controller';
import { inject as service } from '@ember-decorators/service';
import { action } from '@ember-decorators/object';
import fetch from 'fetch';
import Session from "../services/session";
import DS from "ember-data";
import Router from "@ember/routing/router";

export default class extends Controller {

  canLogin = false;
  error = false;
  username: string = '';
  password: string = '';
  rememberMe: boolean = false;

  @service session!: Session;
  @service store!: DS.Store;
  @service router!: Router;
  @service messageBus!: any;

  @action
  update() {
    this.set('canLogin', this.username && this.password);
    this.set('error', false);
  }

  @action
  keyDown(key: any) {
    if (key.keyCode == 13) {
      this.login();
    }
  }

  @action
  login() {
    let formData = new FormData();
    formData.append('username', this.username);
    formData.append('password', this.password);
    formData.append('rememberMe', this.rememberMe.toString());
    fetch('/api/v1/login', {
      method: "post",
      body: formData
    }).then((response: Response) => {
      if (response.ok) {
        this.set('password', undefined);
        this.set('rememberMe', false);
        this.session.setAuthorization(response.headers.get('authorization')!);
        this.messageBus.publish('loggedIn');
        let transition = this.session.transition;
        if (!transition || (transition.intent.url && (transition.intent.url == '/' || transition.intent.url.startsWith('/log'))) || (transition.name && transition.name.startsWith('log'))) {
          let today = new Date();
          this.router.transitionTo('start-list', 'lszb', today.getFullYear() + '-' + (today.getMonth() < 9 ? '0' : '') + (today.getMonth() + 1) + '-' + (today.getDate() < 10 ? '0' : '') + today.getDate());
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
    .catch((error: any) => {
      this.set('error', true);
      console.log('error: ', error);
    });
  }

}
