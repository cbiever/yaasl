import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import AuthenticationChecker from '../mixins/authentication-checker'

export default Route.extend(AuthenticationChecker, {
  store: service(),
  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(
      () => console.info('logged in feedback'),
      () => this.transitionTo('login'));
  },
  model() {
    return this.get('store').findAll('feedback');
  }
});
