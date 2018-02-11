import Ember from 'ember';
import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.JSONAPIAdapter.extend({
  session: Ember.inject.service(),
  store: Ember.inject.service('store'),
  namespace: 'api/v1/rs',
  headers: computed(function() {
    let session = this.get('session');
    let originatorID = session ? session.get('originatorID') : -1;
    let authorization = session ? session.get('authorization') : null;
    return {
      'X-Originator-ID': originatorID,
      'Authorization': authorization
    }
  }).volatile()
});
