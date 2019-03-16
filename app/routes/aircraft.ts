import BaseRoute from "yaasl/routes/baseRoute";

export default class Aircraft extends BaseRoute {

  beforeModel(transition: any) {
    return this.checkAuthenticated(transition).then(
      () => console.info('logged in aircraft'),
      () => this.transitionTo('login'));
  }

  model() {
    return this.store.findAll('aircraft');
  }

}
