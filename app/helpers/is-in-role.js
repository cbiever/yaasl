import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default Helper.extend({
  session: service(),
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
