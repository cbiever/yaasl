import BaseRoute from "./baseRoute";

export default class extends BaseRoute {

  beforeModel(transition: any) {
    return this.checkAuthenticated(transition).then(
      () => console.info('logged in pilots'),
      () => this.transitionTo('login'));
  }

  model() {
    return this.store.findAll('pilot');
  }

}
