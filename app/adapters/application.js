import DS from 'ember-data';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default DS.JSONAPIAdapter.extend(AdapterFetch, {
  session: service(),
  store: service(),
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
