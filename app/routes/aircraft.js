import Ember from 'ember';
import Route from '@ember/routing/route';
import AuthenticationChecker from '../mixins/authentication-checker'

export default Route.extend(AuthenticationChecker, {
  store: Ember.inject.service(),
  beforeModel(transition) {
    return this.checkAuthenticated(transition).then(() => {
      console.info('logged in aircraft');
    },
    () => {
      this.transitionTo('login');
    });
  },
  model() {
    return this.get('store').findAll('aircraft');
  }
});
