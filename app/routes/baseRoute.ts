import Route from '@ember/routing/route';
import { inject as service } from '@ember-decorators/service';
import RSVP from "rsvp";
import fetch from "fetch";
import Session from "../services/session";

export default abstract class BaseRoute extends Route {

  @service session!: Session;
  @service messageBus: any

  checkAuthenticated(transition: any) {
    if (transition.intent.name != 'login') {
      this.session.set('transition', transition);
    }
    return new RSVP.Promise((resolve, reject) => {
      fetch('/api/v1/rs/authorizations')
        .then((response: Response) => {
          if (response.ok) {
            response.json().then((json: string[]) => {
              this.session.setAuthorization(response.headers.get('authorization')!, json);
              this.messageBus.publish('loggedIn');
              resolve();
            });
          }
          else {
            reject();
          }
        })
        .catch((error: any) => {
          console.error('error: ', error);
          reject();
        });
      });
    }

    handleAuthenticationError(error: any) {
      if (error && error.errors && error.errors.length > 0 && error.errors[0].status === '403') {
        if (this.session.hasAuthorization()) {
          console.info('Tried with token from localStorage, but backend responded with 403. Redirecting to login.');
          this.session.clearAuthorization();
          this.replaceWith('login');
          return true;
        }
      }
      return false;
    }

}