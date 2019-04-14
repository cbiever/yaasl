import Service from '@ember/service';
import jwt_decode from 'ember-cli-jwt-decode';

export default class Session extends Service {

  transition?: any;
  authorization?: string;
  originatorID?: string = '-1';
  roles?: string[];

  setAuthorization(authorization: string, roles?: string[]) {
    this.set('authorization', authorization);
    if (roles) {
      this.set('roles', roles);
    }
    else {
      this.set('roles', jwt_decode(authorization));
    }
    window.localStorage.setItem('yaasl_token', authorization);
  }

  hasAuthorization() {
    return this.roles != undefined;
  }

  restoreAuthorization() {
    let authorization = window.localStorage.getItem('yaasl_token');
    if (authorization) {
      this.setAuthorization(authorization);
      return true;
    }
    else {
      return false;
    }
  }

  clearAuthorization() {
    this.set('authorization', null);
    this.set('roles', null);
    window.localStorage.removeItem('yaasl_token');
  }

  isInRole(role: string) {
    let isInRole = false;
    if (this.roles) {
      this.roles.forEach(r => {
        if (r === role) {
          isInRole = true;
        }
      });
    }
    return isInRole;
  }

}
