import Service from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';

export default class extends Service {

  setAuthorization(authorization, roles) {
    this.set('authorization', authorization);
    if (roles) {
      this.set('roles', roles);
    }
    else {
      this.set('roles', jwtDecode(authorization).roles);
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

  isInRole(role) {
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
