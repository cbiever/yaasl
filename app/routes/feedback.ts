import BaseRoute from "./baseRoute";

export default class Feedback extends BaseRoute {

  beforeModel(transition: any) {
    return this.checkAuthenticated(transition).then(
      () => console.info('logged in feedback'),
      () => this.transitionTo('login'));
  }

  model() {
    return this.store.findAll('feedback');
  }

}
