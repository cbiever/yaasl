import Ember from 'ember';
import Helper from '@ember/component/helper';

export default Helper.extend({
  session: Ember.inject.service(),
  compute([value, ...rest]) {
    let isInRole = false;
    rest.push(value);
    rest.forEach(role => {
      if (!isInRole) {
        isInRole = this.get('session').isInRole(role);
      }
    });
    return isInRole;
  }
});
