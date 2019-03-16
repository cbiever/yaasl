import DS from 'ember-data';
import { computed } from '@ember-decorators/object';
import { inject as service } from '@ember-decorators/service';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import Session from "../services/session";

export default class Application extends DS.JSONAPIAdapter.extend(AdapterFetch) {

  @service session!: Session;
  @service store!: DS.Store;

  namespace = 'api/v1/rs'

  @(computed().volatile())
  get headers(): any {
    let originatorID = this.session ? this.session.get('originatorID') : -1;
    let authorization = this.session ? this.session.get('authorization') : null;
    return {
      'X-Originator-ID': originatorID,
      'Authorization': authorization
    }
  }

}

