import Mixin from '@ember/object/mixin';
import Ember from 'ember';

export default Mixin.create({
  session: Ember.inject.service(),
  isAuthenticated(transition) {
    let session = this.get('session');
    if (transition.intent.name != 'login') {
      session.set('transition', transition);
    }
    if (session.get('authorization')) {
      return true;
    }
    else {
      if (window.localStorage.getItem('yaasl_token')) {
        session.set('authorization', window.localStorage.getItem('yaasl_token'));
        return true;
      }
      else {
        this.transitionTo('login');
        return false;
      }
    }
  }
});
