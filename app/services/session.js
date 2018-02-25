import Service from '@ember/service';

export default Service.extend({
  transition: undefined,
  authorization: undefined,
  rememberMe: false,
  originatorID: undefined,
  location: undefined,
  date: undefined,
  roles: [],
  idInRole(role) {
    let isInRole = false;
    this.roles.forEach((r) => {
      if (r === role) {
        isInRole = true;
      }
    });
    return isInRole;
  }
});
