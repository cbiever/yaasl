import Helper from '@ember/component/helper';
import { inject as service } from '@ember-decorators/service';
import Session from "../services/session";

export default class IsInRole extends Helper {

  @service session!: Session;

  compute(roles: string[]): boolean {
    let isInRole = false;
    roles.forEach(role => {
      if (!isInRole) {
        isInRole = this.session.isInRole(role);
      }
    });
    return isInRole;
  }

}
