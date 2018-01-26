import Ember from 'ember';
import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.JSONAPIAdapter.extend({
  store: Ember.inject.service('store'),
  namespace: 'api/v1/rs',
  headers: computed(function() {
    let session = this.get('store').peekRecord('session', 42);
    let originatorID = session ? session.get('originatorID') : -1;
    return {
      'X-Originator-ID': originatorID
    }
  }).volatile()
});
