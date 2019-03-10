import DS from 'ember-data';
import { computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default class extends DS.JSONAPIAdapter.extend(AdapterFetch) {

  @service session
  @service store

  namespace = 'api/v1/rs'

  @(computed().volatile())
  get headers() {
    let session = this.get('session');
    let originatorID = session ? session.get('originatorID') : -1;
    let authorization = session ? session.get('authorization') : null;
    return {
      'X-Originator-ID': originatorID,
      'Authorization': authorization
    }
  }

}

