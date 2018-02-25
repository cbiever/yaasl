import Ember from 'ember';
import Route from '@ember/routing/route';
import AuthenticationChecker from '../mixins/authentication-checker'

export default Route.extend(AuthenticationChecker, {
  store: Ember.inject.service(),
  beforeModel(transition) {
    this.isAuthenticated(transition);
  },
  model() {
    return this.get('store').findAll('pilot');
  }
});
