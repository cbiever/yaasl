import Service from '@ember/service';
import jwtDecode from 'ember-cli-jwt-decode';

export default Service.extend({
  setAuthorization(authorization) {
    this.set('authorization', authorization);
    this.set('roles', jwtDecode(authorization).roles);
    window.localStorage.setItem('yaasl_token', authorization);
  },
  hasAuthorization() {
    return this.get('authorization') != undefined;
  },
  restoreAuthorization() {
    let authorization = window.localStorage.getItem('yaasl_token');
    if (authorization) {
      this.set('authorization', authorization);
      return true;
    }
    else {
      return false;
    }
  },
  clearAuthorization() {
    this.set('authorization', undefined);
    window.localStorage.removeItem('yaasl_token');
  },
  idInRole(role) {
    let isInRole = false;
    if (this.get('roles')) {
      this.get('roles').forEach((r) => {
        if (r === role) {
          isInRole = true;
        }
      });
    }
    return isInRole;
  }
});
