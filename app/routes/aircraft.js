import BaseRoute from "./baseRoute";
import { inject as service } from '@ember-decorators/service';

export default class extends BaseRoute {

  @service store

  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(
      () => console.info('logged in aircraft'),
      () => this.transitionTo('login'));
  }

  model() {
    return this.store.findAll('aircraft');
  }

}
