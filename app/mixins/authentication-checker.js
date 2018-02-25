import Mixin from '@ember/object/mixin';
import Ember from 'ember';

export default Mixin.create({
  session: Ember.inject.service(),
  isAuthenticated(transition) {
    if (transition.intent.name != 'login') {
      this.get('session').set('transition', transition);
    }
    if (this.get('session').get('authorization')) {
      return true;
    }
    else {
      this.transitionTo('login');
      return false;
    }
  }
});
